module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define("Setting", {
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    notificationEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    theme: {
      type: DataTypes.ENUM("dark", "light"),
      defaultValue: "light",
    },
    visibility: {
      type: DataTypes.ENUM("public", "private"),
      defaultValue: "public",
    },
  });

  return Setting;
};
