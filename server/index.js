const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secretKey = 'talha';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URL;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Define the user schema and model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      // Check if the token matches the user's ID
      if (user.userID !== req.params.userID) {
        return res.sendStatus(401);
      }
  
      req.user = user;
      next();
    });
  };
  

// Signup route
app.post('/api/createuser', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists with the given email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign-in check endpoint
app.post('/api/signincheck', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists with the given email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the entered password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create and sign JWT token
      const token = jwt.sign({ userID: user._id }, secretKey, { expiresIn: '1h' });
  
      // Send the JWT token as the response
      return res.status(200).json({ token, userID: user._id});
    } catch (error) {
      console.error('Error during sign-in:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  app.get('/api/dashboard/:userID', authenticateToken, async (req, res) => {
    try {
      // Access the authenticated user's ID
      const userID = req.params.userID;
    
      // Fetch the user data from the database
      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      // Extract the relevant user data
      const userData = {
        name: user.name,
        email: user.email,
      };
    
      // Send the user data as the response
      return res.status(200).json({ user: userData });
    } catch (error) {
      console.error('Error fetching user data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });