// PUT - Update a user
app.put('/api/users/:id', (req: Request<{ id: string }>, res: Response) => {
    const userId = parseInt(req.params.id, 10);
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
  app.delete('/api/users/:id', (req: Request<{ id: string }>, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
  
    if (users.length === initialLength) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    res.status(204).send(); 
  });





// POST a new user with an error
interface User {
    id: number;
    name: string;
    email?: string;
  }
  
  app.post('/api/users', (req: Request, res: Response) => {
    const { name, email } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    const newUser: User = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  });
  
  // Custom error-handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
  
    if (err.message.includes('database')) {
      return res.status(503).json({ error: 'Database error occurred' });
    }
  
    res.status(500).json({ error: 'Something went wrong on the server.' });
  });
  
  // Simulating a validation error
  app.get('/validation-error', (req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Invalid email format.');
    (error as any).name = 'ValidationError';
    next(error);
  });
  



