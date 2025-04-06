module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define("Friend", {
    user1uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // name of the referenced table
        key: "uid",     // primary key in Users table
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    user2uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "uid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  });

  return Friend;
};
