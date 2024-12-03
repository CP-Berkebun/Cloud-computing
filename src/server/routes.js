const { postDiagnoseHandler, getAllDiagnosedHandler, getIdDiagnosedHandler, deleteIdDiagnosedHandler, postSaveDiagnoseHandler } = require("../api/diagnose");

const routes = [
  {
    path: "/diagnoses",
    method: "POST",
    handler: postDiagnoseHandler,
    options: {
      payload: {
        maxBytes: 10 * 1024 * 1024,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    path: "/diagnoses/{userId}",
    method: "GET",
    handler: getAllDiagnosedHandler,
  },
  {
    path: "/diagnoses/{userId}/{diagnosedId}",
    method: "GET",
    handler: getIdDiagnosedHandler,
  },
  {
    path: "/diagnoses/{userId}/{diagnosedId}",
    method: "DELETE",
    handler: deleteIdDiagnosedHandler,
  },
  {
    path: "/diagnoses/{userId}/save",
    method: "POST",
    handler: postSaveDiagnoseHandler,
  },
];

module.exports = routes;
