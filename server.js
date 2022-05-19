import fastify from "fastify";
// import { readFile } from "fs/promises";
import fastifyStatic from "fastify-static";
import path from "path";

const api = fastify({ logger: true });
const site = fastify({ logger: false });

site.register(fastifyStatic, {
  root: path.join(process.cwd(), "html"),
});

// Declare a route
api.get("/", async (request, reply) => {
  api.log.info("data posted");
  return { hello: "world" };
});
// site.get("/", async (request, reply) => {
//   const html = await readFile("./html/1-get.html");
//   reply.send(html);
// });

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
