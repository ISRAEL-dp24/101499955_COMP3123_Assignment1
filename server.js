const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/comp3123_assignment1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));