const { User, Setting, sequelize } = require("../db");

// 🔁 Define trigger and function directly in this file
(async () => {
  try {
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION user_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.age < 16 THEN
          RAISE EXCEPTION 'User must be at least 16 years old';
        END IF;
    
        INSERT INTO "Settings" (
          uid,
          "notificationEnabled",
          theme,
          visibility,
          "createdAt",
          "updatedAt"
        )
        VALUES (
          NEW.uid,
          TRUE,
          'light',
          'public',
          NOW(),
          NOW()
        );
    
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await sequelize.query(`
      DROP TRIGGER IF EXISTS user_trigger ON "Users";
      CREATE TRIGGER user_trigger
      BEFORE INSERT ON "Users"
      FOR EACH ROW
      EXECUTE FUNCTION user_insert_trigger();
    `);

    console.log("✅ User trigger created.");
  } catch (err) {
    console.error("❌ Failed to create trigger:", err);
  }
})();

// ✨ User registration (now simplified)
const registerUser = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    // Email uniqueness check
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Let trigger handle age validation and settings insert
    const newUser = await User.create({
      name,
      age,
      email,
      password,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err);

    if (err.original?.code === "P0001") {
      return res.status(400).json({ error: err.original.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        uid: user.uid,
        name: user.name,
        age: user.age,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};
// controllers/settingsController.js

const updateSettings = async (req, res) => {
  const { uid } = req.body;
  const updates = req.body; // Contains fields like { theme, visibility, notificationEnabled }

  if (!uid) {
    return res.status(400).json({ error: "Missing user ID (uid)" });
  }

  try {
    // Check if settings exist for the user
    const setting = await Setting.findOne({ where: { uid } });

    if (!setting) {
      return res.status(404).json({ error: "Settings not found for user" });
    }

    // Update fields
    await setting.update(updates);

    return res
      .status(200)
      .json({ message: "Settings updated successfully", setting });
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getSettings = async (req, res) => {
  const { uid } = req.query;

  try {
    const settings = await Setting.findOne({ where: { uid } });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    return res.status(200).json({
      theme: settings.theme,
      visibility: settings.visibility,
      notificationEnabled: settings.notificationEnabled,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateSettings,
  getSettings,
};
