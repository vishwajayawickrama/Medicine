const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Local storage for medicines (simulating a database)
let medicines = [];

// Create a new medicine
app.post('/medicine', (req, res) => {
  const medicine = {
    id: Date.now(), // Assigning a unique ID (timestamp) for simplicity
    compartment_number: req.body.compartment_number,
    medicine_name: req.body.medicine_name,
    times_per_day: req.body.times_per_day,
    times: req.body.times,
    dose_per_time: req.body.dose_per_time,
    quantity: req.body.quantity
  };

  medicines.push(medicine);
  res.send('Medicine added...');
});

// Get all medicines
app.get('/medicines', (req, res) => {
  res.json(medicines);
});

// Get a medicine by ID
app.get('/medicine/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const medicine = medicines.find(med => med.id === id);
  if (!medicine) {
    res.status(404).send('Medicine not found');
  } else {
    res.json(medicine);
  }
});

// Update a medicine
app.put('/medicine/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = medicines.findIndex(med => med.id === id);
  if (index === -1) {
    res.status(404).send('Medicine not found');
  } else {
    const updatedMedicine = {
      id: id,
      compartment_number: req.body.compartment_number,
      medicine_name: req.body.medicine_name,
      times_per_day: req.body.times_per_day,
      times: req.body.times,
      dose_per_time: req.body.dose_per_time,
      quantity: req.body.quantity
    };
    medicines[index] = updatedMedicine;
    res.send('Medicine updated...');
  }
});

// Delete a medicine
app.delete('/medicine/:id', (req, res) => {
  const id = parseInt(req.params.id);
  medicines = medicines.filter(med => med.id !== id);
  res.send('Medicine deleted...');
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

