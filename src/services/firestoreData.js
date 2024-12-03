require("dotenv").config();

const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.SERVICE_ACCOUNT,
});

// Menyimpan data
const storeDiagnosis = async (userId, diagnosedId, diagnosisData) => {
  const docRef = firestore.collection("Berkebun+ User Diagnoses").doc(userId).collection("diagnoses").doc(diagnosedId);
  await docRef.set({ ...diagnosisData });
  return "Data saved successfully";
};

// Menampilkan semua hasil diagnosa
const getAllDiagnoses = async (userId) => {
  const docRef = firestore.collection("Berkebun+ User Diagnoses").doc(userId);
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
  const docRef = firestore.collection("Berkebun+ User Diagnoses").doc(userId).collection("diagnoses").doc(diagnosedId);
  const snapshot = await docRef.get();

  return snapshot.data();
};

// Menampilkan hasil diagnosa sesuai diagnosedId
const getDataDisease = async (plantDisease) => {
  const docRef = firestore.collection("Berkebun+ Plant Disease").doc(plantDisease);
  const snapshot = await docRef.get();
  return snapshot.data();
};

// Menghapus data firestore
const deleteDiagnosed = async (userId, diagnosedId) => {
  const docRef = firestore.collection("Berkebun+ User Diagnoses").doc(userId).collection("diagnoses").doc(diagnosedId);
  await docRef.delete();

  return `Data berhasil dihapus`;
};

module.exports = { storeDiagnosis, getDataDisease, deleteDiagnosed, getAllDiagnoses, getDiagnosed };
