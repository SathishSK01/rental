const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '/home/sathish/Desktop/Rental/database.db',
});

const VechicalDetails = sequelize.define('vechicaldetails', {
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  wheel_type: { type: DataTypes.STRING },
  vechical_type: { type: DataTypes.STRING },
  vechical_model: { type: DataTypes.STRING, unique: true },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
});

sequelize.sync()
  .then(() => {
    console.log('Database and tables synced.');
  })
  .catch((error) => {
    console.error('Error syncing database and tables:', error);
  });

app.post('/storeData', async (req, res) => {
  try {
    const newData = req.body;
    const storedRecord = await VechicalDetails.create(newData);
    res.json({ message: 'Data stored successfully', data: storedRecord });
  } catch (error) {
    console.error('Error storing data in the database:', error);
    res.status(500).json({ message: 'This vechical model is already booked' });
  }
});

app.get('/getData', async (req, res) => {
  try {
    const dataFromDB = await VechicalDetails.findAll();
    res.json({ data: dataFromDB });
  } catch (error) {
    console.error('Error retrieving data from the database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
