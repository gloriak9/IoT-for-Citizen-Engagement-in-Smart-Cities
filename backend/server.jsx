const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const commentRoutes = require('./routes/commentRoutes.jsx');
const feedbackRoutes = require('./routes/feedbackRoutes.jsx');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/comments', commentRoutes);
app.use('/api/feedback', feedbackRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
