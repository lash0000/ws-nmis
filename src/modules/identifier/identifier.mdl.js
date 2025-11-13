const { DataTypes } = require('sequelize');
const db_sequelize = require('../../../config/db.config');
const IdentifierCategory = require('../identifier_categories/identifier_categories.mdl');

const Identifier = db_sequelize.define('Identifier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: IdentifierCategory,
      key: 'category_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  identifier_value: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true
  },
  is_archive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "identifiers",
  timestamps: true
});

// Associations
Identifier.belongsTo(IdentifierCategory, {
  foreignKey: 'category_id',
  as: 'category'
});

IdentifierCategory.hasMany(Identifier, {
  foreignKey: 'category_id',
  as: 'identifiers'
});

module.exports = Identifier;
