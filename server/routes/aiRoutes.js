const express = require('express');
const router = express.Router();

router.post('/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ reply: "I need a message to process." });
  }

  const lowercaseMsg = message.toLowerCase();
  let reply = "I am the OnePoint AI assistant! How can I help you today?";

  if (lowercaseMsg.includes('founder') || lowercaseMsg.includes('creator') || lowercaseMsg.includes('who made') || lowercaseMsg.includes('arpit')) {
    reply = "The founder and developer of OnePoint is Arpit Dubey. You can contact him at 7838215474 or via email at arpit391999@gmail.com. He built this software to empower users with free utility tools!";
  } else if (lowercaseMsg.includes('pdf')) {
    reply = "OnePoint offers powerful PDF tools. You can convert images to PDF, or use our PDF resizer to compress large files from MB to KB without losing much quality.";
  } else if (lowercaseMsg.includes('image') || lowercaseMsg.includes('background')) {
    reply = "Our Image tools allow you to resize images to your exact dimensions and remove backgrounds effortlessly using our built-in free AI tool.";
  } else if (lowercaseMsg.includes('ngo')) {
    reply = "OnePoint is perfect for NGOs. Arpit Dubey designed it with free APIs so organizations can utilize powerful tools without monthly subscriptions.";
  } else {
    reply = "That's interesting! I am currently running on a locally optimized intelligence model to keep this service free for NGOs. Is there anything else about OnePoint you'd like to know?";
  }

  // Simulate thinking delay
  setTimeout(() => {
    res.json({ reply });
  }, 1000);
});

module.exports = router;
