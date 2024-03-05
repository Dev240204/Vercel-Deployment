import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './app.css';

function App() {
  const [name, setName] = useState('');
  const [allData, setAllData] = useState([]);
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getData');
      if (response.data.success) {
        setAllData(response.data.data);
      } else {
        console.error('Failed to fetch data:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (updateId) {
        const response = await axios.put(`http://localhost:3001/api/updateData/${updateId}`, { name : name});
        if (response.data.success) {
          console.log('Data updated successfully:', response.data.data);
          setUpdateId(null);
        } else {
          console.error('Failed to update data:', response.data.message);
        }
      } else {
        const response = await axios.post('http://localhost:3001/api/saveData', { name : name });
        if (response.data.success) {
          console.log('Data saved successfully:', response.data.data);
        } else {
          console.error('Failed to save data:', response.data.message);
        }
      }
      fetchData();
      setName('');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleUpdate = (id) => {
    const selectedData = allData.find((item) => item._id === id);
    if (selectedData) {
      setName(selectedData.name);
      setUpdateId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/deleteData/${id}`);
      if (response.data.success) {
        console.log('Data deleted successfully');
        fetchData();
      } else {
        console.error('Failed to delete data:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <h1>React Frontend</h1>
      <label>
        Enter Data:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <button onClick={handleSubmit}>{updateId ? 'Update' : 'Submit'}</button>

      <h2>Data List:</h2>
      <ul>
        {allData.map((item) => (
          <li key={item._id}>
            {item.name}
            <button onClick={() => handleUpdate(item._id)}>Update</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
