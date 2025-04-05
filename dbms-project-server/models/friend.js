module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define("Friend", {
    user1uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user2uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Friend;
};
