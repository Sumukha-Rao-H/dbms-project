const { User, Setting } = require("../db");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    // Age check
    if (age < 16) {
      return res.status(400).json({ error: "Not old enough" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create user
    const newUser = await User.create({
      name,
      age,
      email,
      password, // NOTE: Ideally hash the password before storing
    });

    // Initialize default settings for the new user
    await Setting.create({
      uid: newUser.uid,
      notificationEnabled: true,
      theme: "light",
      visibility: "public",
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
};
