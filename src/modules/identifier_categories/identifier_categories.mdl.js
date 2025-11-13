const { DataTypes } = require('sequelize');
const db_sequelize = require('../../../config/db.config');

const IdentifierCategory = db_sequelize.define('IdentifierCategory', {
  category_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  tableName: 'identifier_categories',
  timestamps: true,
});

module.exports = IdentifierCategory;
