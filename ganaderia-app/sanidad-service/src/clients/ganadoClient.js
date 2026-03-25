const axios = require('axios');
const AppError = require('../exceptions/AppError');

const getAnimal = async (chapeta) => {
  try {
    const res = await axios.get(`${process.env.GANADO_SERVICE_URL}/api/animales/${chapeta}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new AppError(`Animal con chapeta ${chapeta} no encontrado`, 404);
    }
    throw new AppError('Error al comunicarse con ganado-service', 503);
  }
};

module.exports = { getAnimal };
