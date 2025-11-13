const Identifier = require('./identifier.mdl');
const IdentifierCategory = require('../identifier_categories/identifier_categories.mdl');

class IdentifierServices {
  // ======================================
  // CATEGORY SERVICES
  // ======================================

  async addCategory(name, description) {
    if (!name) throw new Error('Category name is required.');

    const exists = await IdentifierCategory.findOne({ where: { name } });
    if (exists) throw new Error('Category already exists.');

    return await IdentifierCategory.create({
      name,
      description: description || null
    });
  }

  async getCategory(id = null) {
    if (id) {
      const category = await IdentifierCategory.findByPk(String(id));
      if (!category) throw new Error('Category not found.');
      return category;
    }

    return await IdentifierCategory.findAll();
  }

  async updateCategory(id, data) {
    const category = await IdentifierCategory.findByPk(String(id));
    if (!category) throw new Error('Category not found.');

    await category.update(data);
    return category;
  }

  // ======================================
  // IDENTIFIER SERVICES
  // ======================================

  async addIdentifier(category_id, identifier_value) {
    if (!identifier_value) {
      throw new Error('Identifier value is required.');
    }

    // Force UUID to string
    const cat = await this.getCategory(String(category_id));
    if (!cat) throw new Error('Category not found.');

    try {
      const identifier = await Identifier.create({
        identifier_value,
        category_id: String(category_id)
      });

      return identifier;
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw new Error(`Identifier value (or plate number) "${identifier_value}" already exists.`);
      }
      throw err;
    }
  }


  async getIdentifier(id = null) {
    if (id) {
      const identifier = await Identifier.findByPk(id, {
        include: [{ model: IdentifierCategory, as: 'category' }]
      });
      if (!identifier) throw new Error('Identifier not found.');
      return identifier;
    }

    return await Identifier.findAll({
      include: [{ model: IdentifierCategory, as: 'category' }]
    });
  }

  async updateIdentifier(id, data) {
    const identifier = await Identifier.findByPk(id);
    if (!identifier) throw new Error('Identifier not found.');

    // If changing category, verify it exists
    if (data.category_id) {
      const cat = await this.getCategory(String(data.category_id));
      if (!cat) throw new Error('Category not found.');
    }

    await identifier.update(data);
    return identifier;
  }


  async archiveIdentifier(id) {
    const identifier = await Identifier.findByPk(id);
    if (!identifier) throw new Error('Identifier not found.');

    await identifier.update({ is_archive: true });
    return identifier;
  }


  async deleteAllIdentifiers() {
    // Fetch only archived identifiers
    const archivedList = await Identifier.findAll({ where: { is_archive: true } });

    if (!archivedList.length) {
      throw new Error('No archived identifiers found. Nothing to delete.');
    }

    await Identifier.destroy({ where: { is_archive: true } });
    return { deleted_count: archivedList.length };
  }
}

module.exports = IdentifierServices;
