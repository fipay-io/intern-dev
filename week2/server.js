// Import required modules
const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json()); // Built-in middleware for parsing JSON

// Example of custom middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware or route handler
});

// ROUTING
// Define a basic route
app.get('/', (req, res) => {
  res.send('Welcome to the REST API!');
});

// REST API ROUTES
// Example resource: "users"
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users); // Respond with the list of users
});

// GET a single user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    // If user not found, pass an error to the error handler
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST a new user
app.post('/api/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser); // Respond with the created user
});

// MIDDLEWARE FOR ERROR HANDLING
// Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ error: 'Something went wrong!' }); // Respond with a generic error message
});

// ERROR HANDLING EXAMPLE
// Simulate an error for demonstration
app.get('/error', (req, res, next) => {
  const error = new Error('This is a simulated error.');
  next(error); // Pass the error to the error-handling middleware
});

// START THE SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});