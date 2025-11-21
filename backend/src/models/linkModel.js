const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Link = sequelize.define(
  "Link",
  {
    code: {
      type: DataTypes.STRING(8),
      primaryKey: true,
    },
    target_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_clicked: {
      type: DataTypes.DATE,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "links",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Link;
