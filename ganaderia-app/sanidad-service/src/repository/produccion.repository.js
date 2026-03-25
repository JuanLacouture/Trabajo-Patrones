const db = require('../config/firebase');
const produccionRef = db.collection('produccion_leche');

const registrarLeche = async (data) => {
  const docRef = await produccionRef.add(data);
  return { id: docRef.id, ...data };
};

const listarLechePorAnimal = async (chapeta) => {
  const snapshot = await produccionRef.where('chapeta', '==', chapeta).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = { registrarLeche, listarLechePorAnimal };
