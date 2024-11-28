require("dotenv").config();

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.SERVICE_ACCOUNT,
});

const bucketName = storage.bucket(process.env.BERKEBUN_BUCKET);

const uploadImageToGCS = async (buffer) => {
  const fileName = `user-img/${Date.now()}`;
  const file = bucketName.file(fileName);

  // Create a writable stream
  const stream = file.createWriteStream({
    resumable: true,
    metadata: {
      contentType: "image/jpeg",
    },
  });

  // Handle stream events
  stream.on("error", (err) => {
    console.error("Upload error:", err);
    throw new Error("Failed to upload image to GCS");
  });

  stream.on("finish", () => {
    console.log("Upload successful");
  });

  // End the stream with the buffer data
  stream.end(buffer);

  return `https://storage.googleapis.com/${process.env.BERKEBUN_BUCKET}/${fileName}`;
};

module.exports = { uploadImageToGCS };
