// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const UserModel = require('../models/user');
const MessageModel = require('../models/message');
const FriendModel = require('../models/friend');
const PostModel = require('../models/post');
const CommentModel = require('../models/comment');
const SettingModel = require('../models/setting');

const databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true, // SSL is required for production environments
            rejectUnauthorized: false, // Handle SSL certificates
          }
        : false, // Disable SSL for local development
  },
  pool: {
    max: 10, // Max number of connections in the pool
    min: 0, // Min number of connections in the pool
    acquire: 30000, // Time (in ms) before a connection is considered as failed
    idle: 10000, // Time (in ms) before a connection is released from the pool
  },
  logging: false, // Disable logging
});

const User = UserModel(sequelize, DataTypes);
const Message = MessageModel(sequelize, DataTypes);
const Friend = FriendModel(sequelize, DataTypes);
const Post = PostModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);
const Setting = SettingModel(sequelize, DataTypes);

// Associations
User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(Comment);
User.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Post);

User.hasMany(Message);

User.hasOne(Setting);
Setting.belongsTo(User , { foreignKey: 'uid' });

User.hasMany(Message, { foreignKey: "senderId", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "ReceivedMessages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" });

// Friends is a self-referencing relationship
User.belongsToMany(User, {
  through: Friend,
  as: 'Friends',
  foreignKey: 'user1uid',
  otherKey: 'user2uid'
});

sequelize.sync({ alter: true })
  .then(() => console.log('Tables synced'))
  .catch(console.error);

module.exports = { sequelize, User, Message, Friend, Post, Comment, Setting };
