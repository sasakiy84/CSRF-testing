import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "fastify-formbody";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import path from "path";

const api = fastify({
  logger: {
    prettyPrint: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});
const site = fastify({ logger: false });

site.register(fastifyStatic, {
  root: path.join(process.cwd(), "html"),
});
api.register(fastifyFormbody);
api.register(fastifyCors, {
  origin: "http://localhost:3000",
  credentials: true,
});
api.register(fastifyCookie, {
  secret: "my-secret",
  parseOptions: {},
});
// Declare a route
api.get("/post-data", async (request, reply) => {
  api.log.info("data posted");
  return {};
});
api.post("/reset-password", async (request, reply) => {
  api.log.info("reset password");
  return "passward reseting succeeded";
});
api.get("/login", async (request, reply) => {
  reply.setCookie("sessionid", "logined");
  reply.send("logined");
});
api.post("/reset-password-with-cookie", async (request, reply) => {
  if (request.cookies.sessionid !== "logined") {
    api.log.info("password resseting failed");
    return "not logined. passward resetting failed\nplease login http://127.0.0.1:4000/login";
  }
  api.log.info("password resseting succeeded");
  return "passward reseting succeeded";
});

// Run the server!
const start = async () => {
  try {
    await api.listen(4000);
  } catch (err) {
    api.log.error(err);
    process.exit(1);
  }
  try {
    await site.listen(3000);
  } catch (err) {
    site.log.error(err);
    process.exit(1);
  }
};
start();
