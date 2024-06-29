const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const medicinesFilePath = path.join(__dirname, 'medicines.json');

// Middleware
app.use(bodyParser.json());

// Helper function to read medicines from the JSON file
function readMedicines() {
  const data = fs.readFileSync(medicinesFilePath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write medicines to the JSON file
function writeMedicines(medicines) {
  fs.writeFileSync(medicinesFilePath, JSON.stringify(medicines, null, 2));
}

// Initialize medicines from the JSON file
let medicines = readMedicines();

// Create a new medicine
app.post("/medicine", (req, res) => {
  const medicine = {
    id: Date.now(), // Assigning a unique ID (timestamp) for simplicity
    compartment_number: req.body.compartment_number,
    medicine_name: req.body.medicine_name,
    times_per_day: req.body.times_per_day,
    times: req.body.times,
    dose_per_time: req.body.dose_per_time,
    quantity: req.body.quantity,
  };

  medicines.push(medicine);
  writeMedicines(medicines);
  res.send("Medicine added...");
});

// Get all medicines
app.get("/medicines", (req, res) => {
  medicines = readMedicines(); // Ensure the latest data is sent
  res.json(medicines);
});

// Get a medicine by ID
app.get("/medicine/:id", (req, res) => {
  const id = parseInt(req.params.id);
  medicines = readMedicines(); // Ensure the latest data is used
  const medicine = medicines.find((med) => med.id === id);
  if (!medicine) {
    res.status(404).send("Medicine not found");
  } else {
    res.json(medicine);
  }
});

// Update a medicine
app.put("/medicine/:id", (req, res) => {
  const id = parseInt(req.params.id);
  medicines = readMedicines(); // Ensure the latest data is used
  const index = medicines.findIndex((med) => med.id === id);
  if (index === -1) {
    res.status(404).send("Medicine not found");
  } else {
    const updatedMedicine = {
      id: id,
      compartment_number: req.body.compartment_number,
      medicine_name: req.body.medicine_name,
      times_per_day: req.body.times_per_day,
      times: req.body.times,
      dose_per_time: req.body.dose_per_time,
      quantity: req.body.quantity,
    };
    medicines[index] = updatedMedicine;
    writeMedicines(medicines);
    res.send("Medicine updated...");
  }
});

// Delete a medicine
app.delete("/medicine/:id", (req, res) => {
  const id = parseInt(req.params.id);
  medicines = readMedicines(); // Ensure the latest data is used
  medicines = medicines.filter((med) => med.id !== id);
  writeMedicines(medicines);
  res.send("Medicine deleted...");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});



