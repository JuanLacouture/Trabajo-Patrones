const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const sanidadRoutes = require('./src/routes/sanidad.routes');
const produccionRoutes = require('./src/routes/produccion.routes');

app.use('/api/sanidad', sanidadRoutes);
app.use('/api/produccion', produccionRoutes);

const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`sanidad-service corriendo en puerto ${PORT}`));

module.exports = app;
