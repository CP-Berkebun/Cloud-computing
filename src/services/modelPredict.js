require("dotenv").config();
const tfjs = require("@tensorflow/tfjs-node");
const preProcessImg = require("../utils/preProcessing");

function loadModel() {
  const bucket = process.env.BERKEBUN_BUCKET;
  const modelUrl = `https://storage.googleapis.com/${bucket}/models/model.json`;
  return tfjs.loadLayersModel(modelUrl);
}

async function predict(model, imageBuffer) {
  const tensor = await preProcessImg(imageBuffer);
  const predictions = await model.predict(tensor).data();
  return predictions;
}

module.exports = { loadModel, predict };
