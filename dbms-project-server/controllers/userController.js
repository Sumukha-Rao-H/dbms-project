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

module.exports = {
  registerUser,
};
