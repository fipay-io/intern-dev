// Import required modules
import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Define a User type
interface User {
  id: number;
  name: string;
}

// Example resource: "users"
const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// Middleware to parse JSON request bodies
app.use(express.json()); // Built-in middleware for parsing JSON

// Example of custom middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware or route handler
});

// ROUTING
// Define a basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the REST API!');
});

// REST API ROUTES

// GET all users
app.get('/api/users', (req: Request, res: Response) => {
  res.json(users); // Respond with the list of users
});

// GET a single user by ID
app.get('/api/users/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === userId);
  if (!user) {
    // If user not found, respond with a 404 error
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST a new user
app.post('/api/users', (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newUser: User = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser); // Respond with the created user
});

// MIDDLEWARE FOR ERROR HANDLING
// Custom error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ error: 'Something went wrong!' }); // Respond with a generic error message
});

// ERROR HANDLING EXAMPLE
// Simulate an error for demonstration
app.get('/error', (req: Request, res: Response, next: NextFunction) => {
  const error = new Error('This is a simulated error.');
  next(error); // Pass the error to the error-handling middleware
});

// START THE SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});