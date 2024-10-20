const express = require('express');
const cors = require('cors'); // Import the cors package
const path = require('path');
const app = express();
const { StackClient } = require('@stackso/js-core');

// Use CORS middleware
app.use(cors({     origin: 'http://localhost:3000' // Allow requests from this origin
}));

app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Handle client-side routing


app.post('/action', (req, res) => {
  const { event, address, points } = req.body;
  const pointsInt = parseInt(points, 10); // Convert points to an integer

    // Log the address to debug
    console.log(`Received address: ${address}`);

    // Basic validation for address (example: check if it's a non-empty string)
    if (!address || typeof address !== 'string' || address.trim() === '') {
      return res.status(400).send('Invalid address format');
    }
    
  const stack = new StackClient({
    apiKey: "45426f5e-5318-4cdf-89a3-404981822448",
    pointSystemId: 5462,
  });

  try {
    const sanitizedAddress = address.replace(/"/g, '');
    console.log(`Sanitized address: ${sanitizedAddress}`); // Log sanitized address
  
    stack.track(event, {
      account: sanitizedAddress,
      points: pointsInt // Use the integer value
    });
    res.send(`Tracked signup for address: ${address} with points: ${pointsInt}`);
  } catch (error) {
    console.error('Error tracking event:', error.message);
    res.status(500).send('Internal server error');
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
