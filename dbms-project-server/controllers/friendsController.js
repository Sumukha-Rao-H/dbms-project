const { Op } = require("sequelize");
const { Friend, User } = require("../db");

// Send a friend request
const sendFriendRequest = async (req, res) => {
  const { senderUid, receiverUid } = req.body;

  if (!senderUid || !receiverUid) {
    return res
      .status(400)
      .json({ error: "Sender and receiver UID are required." });
  }

  if (senderUid === receiverUid) {
    return res
      .status(400)
      .json({ error: "You cannot send a friend request to yourself." });
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
      return res.status(409).json({
        error: "Friend request already exists or users are already friends.",
      });
    }

    // Create new friend request
    const friendRequest = await Friend.create({
      user1uid: senderUid,
      user2uid: receiverUid,
      status: "pending",
    });

    return res
      .status(201)
      .json({ message: "Friend request sent!", friendRequest });
  } catch (err) {
    console.error("Error sending friend request:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
const updateFriend = async (req, res) => {
  const { user1uid, user2uid, action } = req.body;

  if (!user1uid || !user2uid || !action) {
    return res
      .status(400)
      .json({ error: "user1uid, user2uid, and action are required." });
  }

  if (!["accept", "reject"].includes(action.toLowerCase())) {
    return res
      .status(400)
      .json({ error: "Action must be either 'accept' or 'reject'." });
  }

  try {
    const friendRequest = await Friend.findOne({
      where: {
        [Op.or]: [
          { user1uid, user2uid },
          { user1uid: user2uid, user2uid: user1uid },
        ],
        status: "pending",
      },
    });

    if (!friendRequest) {
      return res.status(404).json({
        error: "No pending friend request found between these users.",
      });
    }

    if (action === "accept") {
      friendRequest.status = "accepted";
      await friendRequest.save();
      return res.status(200).json({ message: "Friend request accepted." });
    } else {
      await friendRequest.destroy();
      return res.status(200).json({ message: "Friend request rejected." });
    }
  } catch (err) {
    console.error("Error updating friend request:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  sendFriendRequest,
  updateFriend,
};
