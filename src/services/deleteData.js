require("dotenv").config();

const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.SERVICE_ACCOUNT,
});

// Menghapus data firestore
const deleteDiagnosed = async (userId, diagnosedId) => {
  const docRef = firestore.collection("Berkebun+").doc(userId).collection("diagnoses").doc(diagnosedId);
  await docRef.delete();

  return `Data berhasil dihapus`;
};

module.exports = { deleteDiagnosed };
