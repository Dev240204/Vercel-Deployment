const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;
const cors = require('cors'); // Import cors

mongoose.connect('mongodb+srv://Dev:DnbhNEEwqmNlPGy7@cluster0.qrzymtg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const ExampleModel = mongoose.model('Example', exampleSchema);

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Use the built-in JSON parser middleware

// Create operation
app.post('/api/saveData', async (req, res) => {
  try {
    const newData = req.body.name;

    // Create a document using the correct field name
    const result = await ExampleModel.create({ name: newData });

    res.status(200).json({ success: true, message: 'Data saved successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Read operation
app.get('/api/getData', async (req, res) => {
  try {
    const data = await ExampleModel.find();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Update operation
app.put('/api/updateData/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body.name;
    const result = await ExampleModel.findByIdAndUpdate(id, { name: newData }, { new: true });
    res.status(200).json({ success: true, message: 'Data updated successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Delete operation
app.delete('/api/deleteData/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await ExampleModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
