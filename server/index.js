const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3001;
const cors = require('cors');

const url = 'mongodb+srv://Dev:DnbhNEEwqmNlPGy7@cluster0.qrzymtg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  db = client.db(); // Use the default database
});

// Create operation
app.post('/api/saveData', async (req, res) => {
  try {
    const newData = req.body.name;
    const result = await db.collection('examples').insertOne({ name: newData });
    res.status(200).json({ success: true, message: 'Data saved successfully', data: result.ops[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Read operation
app.get('/api/getData', async (req, res) => {
  try {
    const data = await db.collection('examples').find().toArray();
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
    const result = await db.collection('examples').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { name: newData } },
      { returnOriginal: false }
    );
    res.status(200).json({ success: true, message: 'Data updated successfully', data: result.value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Delete operation
app.delete('/api/deleteData/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('examples').deleteOne({ _id: ObjectId(id) });
    res.status(200).json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
