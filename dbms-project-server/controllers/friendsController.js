const { Op } = require("sequelize");
const { Friend, User } = require("../db");

// Send a friend request
const sendFriendRequest = async (req, res) => {
  const { senderUid, receiverUid } = req.body;

  if (!senderUid || !receiverUid) {
    return res.status(400).json({ error: "Sender and receiver UID are required." });
  }

  if (senderUid === receiverUid) {
    return res.status(400).json({ error: "You cannot send a friend request to yourself." });
  }

  try {
    // Optional: Check if both users exist
    const sender = await User.findByPk(senderUid);
    const receiver = await User.findByPk(receiverUid);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "One or both users not found." });
    }

    // Check if a friend request already exists (either direction)
    const existingRequest = await Friend.findOne({
      where: {
        [Op.or]: [
          { user1uid: senderUid, user2uid: receiverUid },
          { user1uid: receiverUid, user2uid: senderUid },
        ],
      },
    });

    if (existingRequest) {
      return res.status(409).json({ error: "Friend request already exists or users are already friends." });
    }

    // Create new friend request
    const friendRequest = await Friend.create({
      user1uid: senderUid,
      user2uid: receiverUid,
      status: "pending",
    });

    return res.status(201).json({ message: "Friend request sent!", friendRequest });
  } catch (err) {
    console.error("Error sending friend request:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  sendFriendRequest,
};
