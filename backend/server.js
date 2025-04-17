const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = './todos.json';

// Helper to read todos
const readTodos = () => {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper to write todos
const writeTodos = (todos) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

// Get all todos
app.get('/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// Add new todo
app.post('/todos', (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
});

// Update todo
app.put('/todos/:id', (req, res) => {
  const todos = readTodos();
  const updatedTodos = todos.map(todo =>
    todo.id === parseInt(req.params.id)
      ? { ...todo, ...req.body }
      : todo
  );
  writeTodos(updatedTodos);
  res.json({ message: 'Todo updated' });
});

// Delete todo
app.delete('/todos/:id', (req, res) => {
  const todos = readTodos();
  const filteredTodos = todos.filter(todo => todo.id !== parseInt(req.params.id));
  writeTodos(filteredTodos);
  res.json({ message: 'Todo deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
