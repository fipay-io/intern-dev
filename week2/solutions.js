// PUT - Update a user
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
  
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required for update' });
    }
  
    users[userIndex] = { id: userId, name: name };
    res.json(users[userIndex]);
  });
  
  // DELETE - Delete a user
  app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
  
    if (users.length === initialLength) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    res.status(204).send(); 
  });
  



// POST a new user with an error
app.post('/api/users', (req, res) => {
    const { name, email } = req.body; 
  
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  });
  
  // Custom error-handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
  
    // Checking for specific error types and customize messages
    if (err.message.includes('database')) {
      return res.status(503).json({ error: 'Database error occurred' });
    }
  
    res.status(500).json({ error: 'Something went wrong on the server.' });
  });
  
  // Simulating a validation error
  app.get('/validation-error', (req, res, next) => {
    const error = new Error('Invalid email format.');
    error.name = 'ValidationError';
    next(error);
  });
 




// server.js
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Connect to MongoDB 
mongoose.connect('mongodb://localhost:3000/database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define a user schema
const userSchema = new mongoose.Schema({
  name: String
});

// Create a User model
const User = mongoose.model('User', userSchema);

app.use(express.json());

// GET all users from the database
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error); // Pass errors to the error handler
  }
});

// GET a single user by ID from the database
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST a new user to the database
app.post('/api/users', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const newUser = new User({ name });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




// Tests

const request = require('supertest');
const app = require('../server.js');

describe('User API Endpoints', () => {
  let newUser;

  beforeAll(async () => {

  });

  it('should GET /api/users and return an array', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should POST /api/users and create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Charlie' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual('Charlie');
    newUser = res.body;
  });

  it('should GET /api/users/:id and return the correct user', async () => {
    const res = await request(app).get(`/api/users/${newUser.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(newUser);
  });

  it('should return 404 for a non-existent user ID', async () => {
    const res = await request(app).get('/api/users/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

});