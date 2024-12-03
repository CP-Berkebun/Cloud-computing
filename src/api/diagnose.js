const { uploadImageToGCS } = require("../services/uploadData");
const axios = require("axios");
const FormData = require("form-data");
const crypto = require("crypto");
const { storeDiagnosis, getDataDisease, getAllDiagnoses, getDiagnosed, deleteDiagnosed } = require("../services/firestoreData");

// Memproses datanya
const postDiagnoseHandler = async (request, h) => {
  const { image, userId } = request.payload;
  const urlMl = process.env.URL_ML;

  // simpen image ke cloud storage
  const imageUrl = await uploadImageToGCS(Buffer.from(image, "base64"), userId);

  const formData = new FormData();
  formData.append("file", Buffer.from(image, "base64"), {
    filename: "user-image.jpg",
    contentType: "image/jpeg",
  });

  const mlResponse = await axios.post(urlMl, formData, {
    headers: formData.getHeaders(),
  });

  // ngembaliin response
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const plant = mlResponse.data.plant;
  const diagnoses = await getDataDisease(plant);

  const data = {
    diagnosedId: id,
    imageUrl: imageUrl,
    diagnoses: diagnoses,
    createdAt: createdAt,
  };

  const response = h.response({
    status: "success",
    message: "Diagnosis berhasil",
    data,
  });

  response.code(201);
  return response;
};

// Menyimpan data
const postSaveDiagnoseHandler = async (request, h) => {
  const { userId } = request.params;
  const { imageUrl, plant, diagnosedId, tumbuhan, penyakit_id, deskripsi, treatment } = request.payload;

  const diagnosisData = {
    imageUrl: imageUrl,
    plant: plant,
    tumbuhan: tumbuhan,
    penyakit_id: penyakit_id,
    deskripsi: deskripsi,
    treatment: treatment,
  };

  await storeDiagnosis(userId, diagnosedId, diagnosisData);

  const data = { diagnosedId: diagnosedId };

  const response = h.response({
    status: "success",
    message: "Diagnosis berhasil disimpan.",
    data,
  });

  response.code(201);
  return response;
};

// Menampilkan semua data
const getAllDiagnosedHandler = async (request, h) => {
  const { userId } = request.params;

  const diagnosesData = await getAllDiagnoses(userId);

  const diagnoses = Object.entries(diagnosesData).map(([id, diagnosis]) => ({
    id,
    ...diagnosis,
  }));

  const response = h.response({
    status: "success",
    message: "Menampilkan seluruh diagnosa",
    data: { diagnoses: diagnoses },
  });

  response.code(200);
  return response;
};

// Menampilkan data sesuai sama {diagnosedId}
const getIdDiagnosedHandler = async (request, h) => {
  const { userId, diagnosedId } = request.params;

  const data = await getDiagnosed(userId, diagnosedId);

  const response = h.response({
    status: "success",
    message: `Berhasil menampilkan data diagnosis.`,
    data,
  });

  response.code(200);
  return response;
};

// Menghapus data sesuai sama {diagnosedId}
const deleteIdDiagnosedHandler = async (request, h) => {
  const { userId, diagnosedId } = request.params;

  await deleteDiagnosed(userId, diagnosedId);

  const response = h.response({
    status: "success",
    message: `Data diagnosis berhasil dihapus.`,
  });

  response.code(200);
  return response;
};

module.exports = { postDiagnoseHandler, postSaveDiagnoseHandler, getAllDiagnosedHandler, getIdDiagnosedHandler, deleteIdDiagnosedHandler };
