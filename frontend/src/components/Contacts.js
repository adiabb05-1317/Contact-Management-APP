import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:3001/api/contacts";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("name");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const addContact = async () => {
    try {
      const newContact = { name, email, phone };
      const response = await axios.post(API_BASE_URL, newContact);
      setContacts([...contacts, response.data]);
      clearForm();
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const updateContact = async () => {
    try {
      const updatedContact = { name, email, phone };
      await axios.put(`${API_BASE_URL}/${editingContact._id}`, updatedContact);
      setContacts(
        contacts.map((contact) =>
          contact._id === editingContact._id
            ? { ...contact, ...updatedContact }
            : contact
        )
      );
      clearForm();
      setEditingContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const startEditing = (contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
  };

  const downloadContacts = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Email,Phone\r\n";
    contacts.forEach((contact) => {
      csvContent += `${contact.name},${contact.email},${contact.phone}\r\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortContacts = (key) => {
    setSortKey(key);
    setContacts([...contacts].sort((a, b) => a[key].localeCompare(b[key])));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      {/* Search and Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          className="flex-1 p-2 border rounded border-gray-300"
          placeholder="Search by name..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Sort Buttons */}
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={() => sortContacts("name")}
        >
          Sort by Name
        </button>
        {/* ... other sort buttons */}
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Name Input */}
        <div className="flex-1 flex items-center p-2 border rounded border-gray-300">
          <FaUser className="mr-2" />
          <input
            className="flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>

        {/* Email Input */}
        <div className="flex-1 flex items-center p-2 border rounded border-gray-300">
          <FaEnvelope className="mr-2" />
          <input
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        {/* Phone Input */}
        <div className="flex-1 flex items-center p-2 border rounded border-gray-300">
          <FaPhone className="mr-2" />
          <input
            className="flex-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
        </div>

        {/* Add/Update Button */}
        <button
          className={`bg-${
            editingContact ? "green" : "blue"
          }-500 text-white p-2 rounded hover:bg-${
            editingContact ? "green" : "blue"
          }-600`}
          onClick={editingContact ? updateContact : addContact}
        >
          {editingContact ? "Update" : "Add"} Contact
        </button>
      </div>

      {/* Download Button */}
      <button
        className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mb-4"
        onClick={downloadContacts}
      >
        <FaDownload className="inline mr-2" /> Download Contacts
      </button>

      {/* Contacts List */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-4 gap-4 mb-4 font-bold">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Actions</div>
        </div>
        {contacts
          .filter((contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((contact) => (
            <div
              key={contact._id}
              className="grid grid-cols-4 gap-4 items-center border-b pb-4 mb-4"
            >
              <div>{contact.name}</div>
              <div>{contact.email}</div>
              <div>{contact.phone}</div>
              <div>
                <button
                  className="text-green-500 hover:text-green-600 mr-2"
                  onClick={() => startEditing(contact)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => deleteContact(contact._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ContactList;
