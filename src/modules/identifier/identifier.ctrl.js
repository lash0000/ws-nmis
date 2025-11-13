const IdentifierServices = require('./identifier.srv');
const service = new IdentifierServices();

module.exports = (io) => {
  return {

    // -----------------------------
    // IDENTIFIER CONTROLLERS
    // -----------------------------
    addIdentifierData: async (req, res) => {
      try {
        const { category_id, identifier_value } = req.body;

        const result = await service.addIdentifier(category_id, identifier_value);

        // Realtime update
        await req.updateIdentifierCounts();

        res.json({
          success: true,
          message: 'Identifier created successfully.',
          data: result
        });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },

    getIdentifierData: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await service.getIdentifier(id || null);

        res.json({ success: true, data: result });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },

    updateIdentifierData: async (req, res) => {
      try {
        const { id } = req.params;

        const updated = await service.updateIdentifier(id, req.body);

        // Optional realtime (consistency)
        await req.updateIdentifierCounts();

        res.json({
          success: true,
          message: 'Identifier updated successfully.',
          data: updated
        });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },


    archiveIdentifierData: async (req, res) => {
      try {
        const { id } = req.params;

        const result = await service.archiveIdentifier(id);

        await req.updateIdentifierCounts();

        res.json({
          success: true,
          message: 'Identifier archived successfully.',
          data: result
        });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },

    deleteAllIdentifierData: async (req, res) => {
      try {
        const result = await service.deleteAllIdentifiers();
        await req.updateIdentifierCounts();
        if (req.deleteIdentifier) {
          await req.deleteIdentifier();
        }

        res.json({
          success: true,
          message: 'All archived identifiers deleted successfully.',
          data: result
        });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },

    // -----------------------------
    // CATEGORY CONTROLLERS
    // -----------------------------
    addCategory: async (req, res) => {
      try {
        const { name, description } = req.body;

        const result = await service.addCategory(name, description);

        // Category affects count → update live counts
        await req.updateIdentifierCounts();

        res.json({
          success: true,
          message: 'Category created successfully.',
          data: result
        });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },

    getCategoryData: async (req, res) => {
      try {
        const { id } = req.params;

        const result = await service.getCategory(id || null);

        res.json({ success: true, data: result });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    },

    updateCategoryData: async (req, res) => {
      try {
        const { id } = req.params;

        const updated = await service.updateCategory(id, req.body);

        // Category changes also affect counts
        await req.updateIdentifierCounts();

        res.json({
          success: true,
          message: 'Category updated successfully.',
          data: updated
        });
      } catch (err) {
        res.status(400).json({ success: false, error: err.message });
      }
    }
  };


};
