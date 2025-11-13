require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const db_sequelize = require('./config/db.config');
const { broadcastIdentifierUpdate } = require('./src/modules/utils/realtime.utils');
const Identifier = require('./src/modules/identifier/identifier.mdl');
const IdentifierCategory = require('./src/modules/identifier_categories/identifier_categories.mdl');

const app = express();
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] },
  transports: ["websocket"]
});

const PORT = process.env.PORT || 8080;
let identifiers_length = 0;
let identifiers_category_length = 0;

async function updateIdentifierCounts() {
  try {
    identifiers_length = await Identifier.count();
    identifiers_category_length = await IdentifierCategory.count();

    console.log(`[IdentifierCounts] synced -> identifiers: ${identifiers_length}, categories: ${identifiers_category_length}`);

    // Full heartbeat (dashboard)
    io.emit('server:heartbeat', {
      timestamp: new Date().toISOString(),
      identifiers_length,
      identifiers_category_length
    });

    // Lightweight broadcast (other modules)
    broadcastIdentifierUpdate(io, identifiers_length, identifiers_category_length);

  } catch (err) {
    console.error('[updateIdentifierCounts Error]:', err.message);
  }
}


// call once on startup
updateIdentifierCounts();

// expose to routes + handlers
app.use((req, res, next) => {
  req.io = io;
  req.updateIdentifierCounts = updateIdentifierCounts;
  next();
});

// load routes
const routesV1 = require('./src/modules/utils/routes_v1.utils')(io);
app.use('/api/v1/data', routesV1);

// dashboard page
app.get('/', async (req, res) => {
  await updateIdentifierCounts(); // ensure fresh data on render

  res.render('dashboard', {
    project_name: 'National Meal Inspection Service',
    message: 'Real-time plate number monitoring.',
    version: 'alpha-v0',
    identifiers_length,
    identifiers_category_length
  });
});

// socket connection
io.on('connection', async (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // send small initial heartbeat (exact pattern of old project)
  socket.emit('server:heartbeat', {
    timestamp: new Date().toISOString(),
    identifiers_length,
    identifiers_category_length
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
