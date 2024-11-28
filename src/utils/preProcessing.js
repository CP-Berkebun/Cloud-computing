const sharp = require("sharp");
const tf = require("@tensorflow/tfjs-node");

const preProcessImg = async (imgBuffer) => {
  const resizedImage = await sharp(imgBuffer).resize(224, 224).toFormat("jpeg").toBuffer();

  // Decode image, konversi ke float, dan tambahkan batch dimensi
  return tf.node.decodeImage(resizedImage).toFloat().expandDims();
};

module.exports = preProcessImg;
