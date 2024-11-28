const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const InputError = require("../exceptions/InputError");
const { loadModel } = require("../services/modelPredict");

const init = async () => {
  const server = Hapi.server({
    port: 8080,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;
    if (response instanceof InputError) {
      const newResponse = h.response({
        status: "fail",
        message: `${response.message} Silakan gunakan foto lain.`,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};
init();
