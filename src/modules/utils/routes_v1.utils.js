const express = require('express');
const router = express.Router();

module.exports = (io) => {
  const IdentifierRoutes = require('../identifier/identifier.rt')(io);
  // const userFileRoutes = require('../modules/files/files.rt')(io);

  router.use('/', IdentifierRoutes);
  // router.use('/files', userFileRoutes);
  return router;
};
