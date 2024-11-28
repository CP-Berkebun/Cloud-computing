require("dotenv").config();

const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.SERVICE_ACCOUNT,
});

const storeDiagnosis = async (userId, diagnosedId, diagnosisData) => {
  const docRef = firestore.collection("Berkebun+").doc(userId).collection("diagnoses").doc(diagnosedId);

  await docRef.set({ ...diagnosisData });
  return "Data saved successfully";
};

module.exports = { storeDiagnosis };
