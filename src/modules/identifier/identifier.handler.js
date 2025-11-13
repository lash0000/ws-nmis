module.exports = (io) => {
  const Identifier = require('./identifier.mdl');

  return {
    createIdentifier: async (req, res) => {
      try {
        const result = await Identifier.create(req.body);

        await req.updateIdentifierCounts();

        res.json({ success: true, data: result });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    deleteIdentifier: async () => {
      io.emit('identifiers_deleted');
    }
  };
};
