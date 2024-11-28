const { uploadImageToGCS } = require("../services/uploadData");
const { predict } = require("../services/modelPredict");
const crypto = require("crypto");
const { storeDiagnosis } = require("../services/storeData");
const { getAllDiagnoses, getDiagnosed } = require("../services/getData");
const { deleteDiagnosed } = require("../services/deleteData");

// Memposting datanya
const postDiagnoseHandler = async (request, h) => {
  const { image } = request.payload;
  const { model } = request.server.app;

  // simpen image ke cloud storage
  const imageUrl = await uploadImageToGCS(Buffer.from(image, "base64"), { image });

  // ngembaliin response
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const diagnoses = await predict(model, image);

  const data = {
    diagnosedId: id,
    createdAt: createdAt,
    imageUrl: imageUrl,
    diagnoses: diagnoses,
  };

  const response = h.response({
    status: "success",
    message: "diagnosis berhasil",
    data,
  });

  response.code(201);
  return response;
};

// Menyimpan data
const postSaveDiagnoseHandler = async (request, h) => {
  const { userId } = request.params;
  const { diagnosedId, namaPenyakit, deskripsi, penyembuhan } = request.payload;

  const diagnosisData = {
    namaPenyakit: namaPenyakit,
    deskripsi: deskripsi,
    penyembuhan: penyembuhan,
  };

  await storeDiagnosis(userId, diagnosedId, diagnosisData);

  const response = h.response({
    status: "success",
    message: "Diagnosis berhasil disimpan.",
  });

  response.code(201);
  return response;
};

// Menampilkan semua data
const getAllDiagnosedHandler = async (request, h) => {
  const { userId } = request.params;

  const diagnoses = await getAllDiagnoses(userId);

  const response = h.response({
    status: "success",
    message: "menampilkan seluruh diagnosa",
    diagnoses,
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
    message: `menampilkan data ${diagnosedId}`,
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
    message: `data ${diagnosedId} berhasil dihapus`,
  });

  response.code(200);
  return response;
};

module.exports = { postDiagnoseHandler, postSaveDiagnoseHandler, getAllDiagnosedHandler, getIdDiagnosedHandler, deleteIdDiagnosedHandler };
