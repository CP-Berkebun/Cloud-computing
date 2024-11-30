const { uploadImageToGCS } = require("../services/uploadData");
const { predict } = require("../services/modelPredict");
const crypto = require("crypto");
const { storeDiagnosis, getAllDiagnoses, getDiagnosed, deleteDiagnosed } = require("../services/firestoreData");

// Memproses datanya
const postDiagnoseHandler = async (request, h) => {
  const { image, userId } = request.payload;
  const { model } = request.server.app;

  // simpen image ke cloud storage
  const imageUrl = await uploadImageToGCS(Buffer.from(image, "base64"), userId);

  // ngembaliin response
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const diagnoses = await predict(model, image);

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
  const { urlImage, diagnosedId, namaTanaman, namaPenyakit, deskripsi, penyembuhan } = request.payload;

  const diagnosisData = {
    urlImage: urlImage,
    namaTanaman: namaTanaman,
    namaPenyakit: namaPenyakit,
    deskripsi: deskripsi,
    penyembuhan: penyembuhan,
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
    message: `Berhasil menampilkan data diagnosis ${diagnosedId}.`,
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
    message: `Data diagnosis ${diagnosedId} berhasil dihapus.`,
  });

  response.code(200);
  return response;
};

module.exports = { postDiagnoseHandler, postSaveDiagnoseHandler, getAllDiagnosedHandler, getIdDiagnosedHandler, deleteIdDiagnosedHandler };
