const express = require('express');
const router = express.Router();
const Contact = require('../models/contact_model');
const asyncHandler=require('express-async-handler');
const { format } = require('date-fns');
router.get('/', asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });
    res.json(contact);
}));

router.post('/', asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    // Getting the present date using date-fns
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    let contact = new Contact({
        name,
        email,
        phone,
        date: currentDate
    });
    
    await contact.save();
    res.json(contact);
}));
router.put('/:id', asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;

    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    contact = await Contact.findByIdAndUpdate(req.params.id, { $set: contactFields }, { new: true });
    res.json(contact);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        let contact = await Contact.findOne({ _id: req.params.id });
        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        await Contact.findOneAndDelete({ _id: req.params.id });
        res.json({ msg: 'Contact removed' });
    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
}));



module.exports = router;
