// models/post.js
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    pid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    imageUrl: {
      type: DataTypes.STRING,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Post;
};
