import { Server } from "http";
import { App } from "./core";
import { config } from "./config";
import mongoose from "mongoose";

export let http: Server;

export const server = async (supertest = false) => {
  try {
    await mongoose.connect(config.mongodb.url);
    console.log("[mongod] connection successful.");

    const app = await App();
    console.log("[mongod] connection successful.");

    if (!supertest) {
      http = new Server(app);
      http.listen(config.server.port, async () => {
        console.log(`[http] server ${config.server.port} is listening ...`);
      });
    }

    return app;
  } catch (err) {
    console.log(err);
  }
};

if (process.env.NODE_ENV !== "test") server();
