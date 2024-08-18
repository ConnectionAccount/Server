import { Router } from "express";
import { Routes } from "@goodtechsoft/xs-micro-service";
import { auth } from "../middlewares/auth";
import { sign } from "../middlewares/sign";
import { SESSION_SCOPE } from "../constants/SESSION_SCOPE";

export const routes = () => {
  const router = Router();

  router.use("/api", [
    sign(SESSION_SCOPE.NONE),
    Routes(__dirname, [
      "/api/auth/login",
      "/api/auth/forgot",
      "/api/auth/register",
    ]),
  ]);

  router.use("/api", [
    sign(SESSION_SCOPE.FORGOT),
    auth,
    Routes(__dirname, ["/api/otp/get", "/api/otp/verify"]),
  ]);

  router.use("/api", [
    sign(SESSION_SCOPE.CHANGE_PASSWORD),
    auth,
    Routes(__dirname, ["/api/auth/change-password"]),
  ]);

  // router.use("/api", [
  //   sign(SESSION_SCOPE.AUTHORIZED),
  //   auth,
  //   Routes(__dirname, "/app"),
  // ]);

  return router;
};
