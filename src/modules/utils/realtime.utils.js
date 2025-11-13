module.exports = {
  broadcastIdentifierUpdate: (io, identifiers_length, identifiers_category_length) => {
    io.emit('server:identifier_update', {
      timestamp: new Date().toISOString(),
      identifiers_length,
      identifiers_category_length
    });
  }
};
