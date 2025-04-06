const { Op } = require("sequelize");
const { Message } = require("../db"); // Import Message model

// Save a new message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    // Validate input
    if (!senderId || !receiverId || !text) {
      return res
        .status(400)
        .json({ error: "senderId, receiverId, and text are required." });
    }

    // Save to database
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve chat messages between two users
const getChatMessages = async (req, res) => {
  try {
    const { uid1, uid2 } = req.query;

    if (!uid1 || !uid2) {
      return res.status(400).json({ error: "uid1 and uid2 are required." });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: uid1, receiverId: uid2 },
          { senderId: uid2, receiverId: uid1 },
        ],
      },
      order: [["createdAt", "ASC"]], // Optional: sort oldest to newest
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  sendMessage,
  getChatMessages,
};
