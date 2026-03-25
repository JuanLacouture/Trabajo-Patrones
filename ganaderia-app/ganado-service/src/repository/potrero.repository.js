const db = require('../config/firebase');

const potrerosRef = db.collection('potreros');

const crearPotrero = async (data) => {
  const docRef = potrerosRef.doc(data.nombre);
  await docRef.set({ ...data, animales: [] });
  return data;
};

const obtenerPotrero = async (nombre) => {
  const doc = await potrerosRef.doc(nombre).get();
  if (!doc.exists) return null;
  return doc.data();
};

const asignarAnimal = async (nombrePotrero, chapeta) => {
  const ref = potrerosRef.doc(nombrePotrero);
  const doc = await ref.get();
  const potrero = doc.data();
  const animalesActualizados = [...potrero.animales, chapeta];
  await ref.update({ animales: animalesActualizados });
  return { nombrePotrero, animales: animalesActualizados };
};

const listarPotreros = async () => {
  const snapshot = await potrerosRef.get();
  return snapshot.docs.map(doc => doc.data());
};

module.exports = { crearPotrero, obtenerPotrero, asignarAnimal, listarPotreros };
