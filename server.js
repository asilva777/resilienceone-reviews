const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory reviews array (replace with database in production)
let reviews = [
  // Example initial review (optional)
  // { author: "Jane Doe", reviewBody: "Great app!", rating: 5, country: "Singapore", email: "jane@example.com", date: "2025-06-13T16:30:00Z" }
];

// Health check
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Back-end is working!' });
});

// Get all reviews (most recent first)
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

// Submit a new review
app.post('/api/reviews', (req, res) => {
  const { author, email, country, rating, reviewBody } = req.body;

  // Simple validation
  if (
    !author || typeof author !== 'string' || author.length > 50 ||
    !email || typeof email !== 'string' || email.length > 100 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
    !country || typeof country !== 'string' ||
    !Number.isInteger(rating) || rating < 1 || rating > 5 ||
    !reviewBody || typeof reviewBody !== 'string' || reviewBody.length > 500
  ) {
    return res.status(400).json({ error: 'Invalid or missing fields.' });
  }

  const newReview = {
    author,
    email, // In production, do not expose emails in GET
    country,
    rating,
    reviewBody,
    date: new Date().toISOString()
  };

  // Add newest first
  reviews.unshift(newReview);

  res.status(201).json({ message: 'Review submitted!' });
});

// (Optional) Delete all reviews (for dev/testing)
app.delete('/api/reviews', (req, res) => {
  reviews = [];
  res.json({ message: 'All reviews deleted.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
