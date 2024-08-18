import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import session from "express-session";
import { accessControl } from "./headers";
import { config } from "../config";
import { routes } from "../routes";
import useragent from "express-useragent";
import { errorHandler } from "@goodtechsoft/xs-micro-service";

export const App = async () => {
  const app = express();

  app.use(accessControl);
  app.use(useragent.express());
  app.use(cookieParser(config.server.name + ".ckp"));
  app.use(morgan("dev"));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    session({
      name: config.server.name + ".sid",
      secret: config.server.name + ".scr",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(routes());
  app.use(errorHandler());

  return app;
};
