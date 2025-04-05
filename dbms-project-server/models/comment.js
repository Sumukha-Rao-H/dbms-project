// models/comment.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Posts", // name of the referenced table
        key: "pid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // name of the referenced table
        key: "uid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    comment: {
      type: DataTypes.TEXT,
    },
  });

  return Comment;
};
