const express = require('express');
const router = express.Router();
const Person = require('../models/person.model');

// GET /person: List all people
router.get('/', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /person: Create a new person
router.post('/', async (req, res) => {
  const person = new Person({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    mobile: req.body.mobile
  });
  try {
    const newPerson = await person.save();
    res.status(201).json(newPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /person/:id: Edit a person
router.put('/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    person.name = req.body.name;
    person.age = req.body.age;
    person.gender = req.body.gender;
    person.mobile = req.body.mobile;
    await person.save();
    res.json(person);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /person/:id: Delete a person by ID
router.delete('/:id', async (req, res) => {  // Use router.delete()
  try {
    console.log(`Attempting to delete person with ID: ${req.params.id}`); // Debugging
    const result = await Person.findByIdAndDelete(req.params.id);
    console.log(`Deletion result: ${result}`); // Log the result of deletion
    if (!result) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.json({ message: 'Person deleted' });
  } catch (err) {
    console.error('Error during deletion:', err); // Log any errors
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
