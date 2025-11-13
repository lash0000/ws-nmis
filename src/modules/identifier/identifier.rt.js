const express = require('express');
const router = express.Router();

module.exports = (io) => {

  // Your controller MUST be a factory, so we call it with (io)
  const IdentifierController = require('./identifier.ctrl')(io);

  // -----------------------------
  // IDENTIFIER ROUTES
  // -----------------------------
  router.post('/identifier', (req, res) => IdentifierController.addIdentifierData(req, res));
  router.get('/identifier', (req, res) => IdentifierController.getIdentifierData(req, res));
  router.get('/identifier/:id', (req, res) => IdentifierController.getIdentifierData(req, res));
  router.put('/identifier/:id', (req, res) => IdentifierController.updateIdentifierData(req, res));
  router.patch('/identifier/archive/:id', (req, res) => IdentifierController.archiveIdentifierData(req, res));
  router.delete('/identifier', (req, res) => IdentifierController.deleteAllIdentifierData(req, res));

  // -----------------------------
  // CATEGORY ROUTES
  // -----------------------------
  router.post('/category/identifier', (req, res) => IdentifierController.addCategory(req, res));
  router.get('/category/identifier', (req, res) => IdentifierController.getCategoryData(req, res));
  router.get('/category/identifier/:id', (req, res) => IdentifierController.getCategoryData(req, res));
  router.put('/category/identifier/:id', (req, res) => IdentifierController.updateCategoryData(req, res));

  return router;
};
