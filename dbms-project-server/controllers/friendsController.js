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

const getPendingRequests = async (req, res) => {
  const uid = parseInt(req.query.uid, 10);

  if (isNaN(uid)) {
    return res.status(400).json({ error: "Valid numeric UID is required." });
  }

  try {
    const friends = await Friend.findAll({
      where: {
        status: "pending",
        user2uid: uid,
      },
    });

    const friendUids = friends.map((friend) => friend.user1uid);

    const friendDetails = await User.findAll({
      where: {
        uid: {
          [Op.in]: friendUids,
        },
      },
      attributes: ["uid", "name"], // Adjust fields
    });

    return res.status(200).json({ friends: friendDetails });
  } catch (err) {
    console.error("Error fetching friends:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getFriends = async (req, res) => {
  const uid = parseInt(req.query.uid, 10);

  if (isNaN(uid)) {
    return res.status(400).json({ error: "Valid numeric UID is required." });
  }

  if (!uid) {
    return res.status(400).json({ error: "User UID is required." });
  }

  try {
    // Find all accepted friendships involving the user
    const friends = await Friend.findAll({
      where: {
        status: "accepted",
        [Op.or]: [{ user1uid: uid }, { user2uid: uid }],
      },
    });

    // Extract friend UIDs
    const friendUids = friends.map((friend) =>
      friend.user1uid === uid ? friend.user2uid : friend.user1uid
    );

    // Get full user details of friends
    const friendDetails = await User.findAll({
      where: {
        uid: {
          [Op.in]: friendUids,
        },
      },
      attributes: ["uid", "name"], // Adjust fields as needed
    });

    return res.status(200).json({ friends: friendDetails });
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  sendFriendRequest,
  updateFriend,
  getFriends,
  getPendingRequests,
};
