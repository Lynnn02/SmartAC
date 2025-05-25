const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'smartac-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } // 1 hour
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock user database
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, username: 'teacher', password: 'teacher123', role: 'teacher', name: 'Teacher User' },
  { id: 3, username: 'student', password: 'student123', role: 'student', name: 'Student User' }
];

// Mock sessions database
const sessions = [
  { id: 1, name: 'AC Maintenance Class', teacher: 'Teacher User', practical: 'Praktikal 1', date: '2025-05-30', time: '10:00 AM' }
];

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Role-based authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (req.session.user && roles.includes(req.session.user.role)) {
      return next();
    }
    res.status(403).render('error', { message: 'Access denied' });
  };
};

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    switch (req.session.user.role) {
      case 'admin':
        return res.redirect('/admin/dashboard');
      case 'teacher':
        return res.redirect('/teacher/dashboard');
      case 'student':
        return res.redirect('/student/dashboard');
    }
  }
  res.render('index');
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    };
    
    switch (user.role) {
      case 'admin':
        return res.redirect('/admin/dashboard');
      case 'teacher':
        return res.redirect('/teacher/dashboard');
      case 'student':
        return res.redirect('/student/dashboard');
    }
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Admin routes
app.get('/admin/dashboard', isAuthenticated, authorize(['admin']), (req, res) => {
  res.render('admin/dashboard', { user: req.session.user, users });
});

app.get('/admin/users', isAuthenticated, authorize(['admin']), (req, res) => {
  const role = req.query.role;
  let filteredUsers = users;
  
  if (role) {
    filteredUsers = users.filter(u => u.role === role);
  }
  
  res.render('admin/users', { user: req.session.user, users: filteredUsers, role });
});

app.get('/admin/users/create', isAuthenticated, authorize(['admin']), (req, res) => {
  res.render('admin/users-create', { user: req.session.user });
});

app.post('/admin/users/create', isAuthenticated, authorize(['admin']), (req, res) => {
  const { name, username, password, role, email, studentId, specialization } = req.body;
  
  // Generate a new user ID (in a real app, this would be handled by the database)
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  
  // Create the new user object
  const newUser = {
    id: newId,
    username,
    password,
    role,
    name
  };
  
  // Add the user to our mock database
  users.push(newUser);
  
  // Redirect back to the users list
  res.redirect('/admin/users');
});

app.get('/admin/users/:id/edit', isAuthenticated, authorize(['admin']), (req, res) => {
  const userId = parseInt(req.params.id);
  const userToEdit = users.find(u => u.id === userId);
  
  if (!userToEdit) {
    return res.status(404).render('error', { message: 'User not found' });
  }
  
  res.render('admin/users-edit', { user: req.session.user, userToEdit });
});

app.post('/admin/users/:id/edit', isAuthenticated, authorize(['admin']), (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, username, password, role, email, studentId, specialization } = req.body;
  
  // Find the user to update
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).render('error', { message: 'User not found' });
  }
  
  // Update the user object
  users[userIndex].name = name;
  users[userIndex].username = username;
  users[userIndex].role = role;
  
  // Only update password if provided
  if (password) {
    users[userIndex].password = password;
  }
  
  // Update optional fields
  if (email) users[userIndex].email = email;
  if (role === 'student' && studentId) users[userIndex].studentId = studentId;
  if (role === 'teacher' && specialization) users[userIndex].specialization = specialization;
  
  // Redirect back to the users list
  res.redirect('/admin/users');
});

app.get('/admin/profile', isAuthenticated, authorize(['admin']), (req, res) => {
  res.render('admin/profile', { user: req.session.user });
});

// Teacher routes
app.get('/teacher/dashboard', isAuthenticated, authorize(['teacher']), (req, res) => {
  res.render('teacher/dashboard', { user: req.session.user, sessions });
});

app.get('/teacher/create-session', isAuthenticated, authorize(['teacher']), (req, res) => {
  res.render('teacher/create-session', { user: req.session.user });
});

app.get('/teacher/profile', isAuthenticated, authorize(['teacher']), (req, res) => {
  res.render('teacher/profile', { user: req.session.user });
});

app.get('/teacher/practical/:id', isAuthenticated, authorize(['teacher']), (req, res) => {
  const practicalId = req.params.id;
  res.render('teacher/practical', { user: req.session.user, practicalId });
});

// Student routes
app.get('/student/dashboard', isAuthenticated, authorize(['student']), (req, res) => {
  res.render('student/dashboard', { user: req.session.user, sessions });
});

app.get('/student/practical/:id', isAuthenticated, authorize(['student']), (req, res) => {
  const practicalId = req.params.id;
  res.render('student/practical', { user: req.session.user, practicalId });
});

app.get('/student/components', isAuthenticated, authorize(['student']), (req, res) => {
  res.render('student/components', { user: req.session.user });
});

// Individual component routes
app.get('/student/component/:componentId', isAuthenticated, authorize(['student']), (req, res) => {
  const componentId = req.params.componentId;
  let modelFile = '';
  let componentName = '';
  
  // Map component IDs to their model files
  switch(componentId) {
    case 'pressure-switch':
      modelFile = 'PressureSwitch.glb';
      componentName = 'Pressure Switch';
      break;
    case 'receiver-drier':
      modelFile = 'ReceiverDrier.glb';
      componentName = 'Receiver Drier';
      break;
    case 'sight-glass':
      modelFile = 'SightGlass.glb';
      componentName = 'Sight Glass';
      break;
    case 'txv':
      modelFile = 'TXV.glb';
      componentName = 'Thermal Expansion Valve';
      break;
    default:
      modelFile = '';
      componentName = 'Component Not Found';
  }
  
  res.render('student/component-detail', { 
    user: req.session.user,
    componentId: componentId,
    modelFile: modelFile,
    componentName: componentName
  });
});

app.get('/student/profile', isAuthenticated, authorize(['student']), (req, res) => {
  res.render('student/profile', { user: req.session.user });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
