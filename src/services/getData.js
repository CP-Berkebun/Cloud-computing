require("dotenv").config();

const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.SERVICE_ACCOUNT,
});

// Menampilkan semua hasil diagnosa
const getAllDiagnoses = async (userId) => {
  const docRef = firestore.collection("Berkebun+").doc(userId);
  const collections = await docRef.listCollections();
  let allDiagnoses = {};
  for (const collection of collections) {
    const snapshot = await collection.get();

    snapshot.forEach((doc) => {
      allDiagnoses[doc.id] = doc.data();
    });
  }
  return allDiagnoses;
};

// Menampilkan hasil diagnosa sesuai diagnosedId
const getDiagnosed = async (userId, diagnosedId) => {
  const docRef = firestore.collection("Berkebun+").doc(userId).collection("diagnoses").doc(diagnosedId);
  const snapshot = await docRef.get();

  return snapshot.data();
};

module.exports = { getAllDiagnoses, getDiagnosed };