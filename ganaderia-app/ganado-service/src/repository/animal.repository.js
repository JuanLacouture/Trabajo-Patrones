const db = require('../config/firebase');

const animalesRef = db.collection('animales');

const crearAnimal = async (data) => {
  const docRef = animalesRef.doc(data.chapeta);
  const existe = await docRef.get();
  if (existe.exists) throw { statusCode: 400, message: `La chapeta ${data.chapeta} ya está registrada`, isOperational: true };
  await docRef.set(data);
  return { id: data.chapeta, ...data };
};

const obtenerAnimalPorChapeta = async (chapeta) => {
  const doc = await animalesRef.doc(chapeta).get();
  if (!doc.exists) return null;
  return doc.data();
};

const listarAnimales = async () => {
  const snapshot = await animalesRef.get();
  return snapshot.docs.map(doc => doc.data());
};

const actualizarAnimal = async (chapeta, data) => {
  await animalesRef.doc(chapeta).update(data);
  return { chapeta, ...data };
};

module.exports = { crearAnimal, obtenerAnimalPorChapeta, listarAnimales, actualizarAnimal };
