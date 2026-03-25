const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const animalRoutes = require('./src/routes/animal.routes');
app.use('/api/animales', animalRoutes);

const potreroRoutes = require('./src/routes/potrero.routes');
app.use('/api/potreros', potreroRoutes);  // ← agregar esta línea

const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ganado-service corriendo en puerto ${PORT}`));

module.exports = app;
