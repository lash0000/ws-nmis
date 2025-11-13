const IdentifierCategory = require('./identifier_categories.mdl');

class IdentifierCategoryServices {
  async addCategory(name, description = null) {
    if (!name) throw new Error('Category name is required.');

    const existingCategory = await IdentifierCategory.findOne({ where: { name } });
    if (existingCategory) throw new Error('Category already exists.');

    const newCategory = await IdentifierCategory.create({ name, description });
    return newCategory;
  }

  // Retrieve all categories or by ID
  async getCategory(id = null) {
    if (id) {
      const category = await IdentifierCategory.findByPk(id);
      if (!category) throw new Error('Category not found.');
      return category;
    }
    return await IdentifierCategory.findAll();
  }

  // Update category details
  async updateCategory(id, data) {
    const category = await IdentifierCategory.findByPk(id);
    if (!category) throw new Error('Category not found.');

    await category.update(data);
    return category;
  }
}

module.exports = IdentifierCategoryServices;
