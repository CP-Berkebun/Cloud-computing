require("dotenv").config();
const tfjs = require("@tensorflow/tfjs-node");
const preProcessImg = require("../utils/preProcessing");

function loadModel() {
  const bucket = process.env.BERKEBUN_MODEL_BUCKET;
  // const modelUrl = `https://storage.googleapis.com/${bucket}/models/model.json`;
  // const modelUrl = `https://storage.googleapis.com/${bucket}/model2/model.json`;
  const modelUrl = `https://storage.googleapis.com/${bucket}/modelbangkit/model.json`;
  return tfjs.loadGraphModel(modelUrl);
}

async function predict(model, imageBuffer) {
  const tensor = await preProcessImg(imageBuffer);
  const predictions = await model.predict(tensor).data();
  return predictions;
}

module.exports = { loadModel, predict };
