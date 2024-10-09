const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB Atlas connection URI
const mongoUri = 'your-mongodb-atlas-uri'; // Replace with your actual URI

// Connect to MongoDB Atlas
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Person schema
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  mobile: String
});

// Create a Person model
const Person = mongoose.model('Person', personSchema);

// GET /person - Retrieve all people
app.get('/person', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /person - Create a new person
app.post('/person', async (req, res) => {
  const person = new Person({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    mobile: req.body.mobile
  });

  try {
    const savedPerson = await person.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /person/:id - Update a person by ID
app.put('/person/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    person.name = req.body.name;
    person.age = req.body.age;
    person.gender = req.body.gender;
    person.mobile = req.body.mobile;

    const updatedPerson = await person.save();
    res.json(updatedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /person/:id - Delete a person by ID
app.delete('/person/:id', async (req, res) => {
    try {
        console.log(`Attempting to delete person with ID: ${req.params.id}`); // Log the ID
        const result = await Person.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
