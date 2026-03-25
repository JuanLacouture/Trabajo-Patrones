const db = require('../config/firebase');
const sanidadRef = db.collection('vacunaciones');
const tratamientosRef = db.collection('tratamientos');

const registrarVacuna = async (data) => {
  const docRef = await sanidadRef.add(data);
  return { id: docRef.id, ...data };
};

const registrarTratamiento = async (data) => {
  const docRef = await tratamientosRef.add(data);
  return { id: docRef.id, ...data };
};

const listarVacunasPorAnimal = async (chapeta) => {
  const snapshot = await sanidadRef.where('chapeta', '==', chapeta).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = { registrarVacuna, registrarTratamiento, listarVacunasPorAnimal };
