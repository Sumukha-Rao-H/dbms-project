const { Message } = require('../db'); // Import Message model

// Save a new message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    // Validate input
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: "senderId, receiverId, and text are required." });
    }

    // Save to database
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    res.status(201).json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  sendMessage,
};
