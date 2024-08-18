import { SESSION_SCOPE } from "../constants/SESSION_SCOPE";
import { IUser } from "../models/User";
import { db } from "@goodtechsoft/xs-mongodb";
import { Session } from "../models/Session";
import express from "express";

export interface Request extends express.Request {
  user?: IUser;
  sessionId?: string | null;
  sessionScope?: SESSION_SCOPE;
  deviceToken?: string | null;
  deviceImei?: string | null;
}

export type Response = express.Response;

export const getSession = async (req: Request) => {
  const SESSION_ID = db.ObjectId(req.sessionId || undefined);
  let SESSION = await Session.findById(SESSION_ID);

  if (!SESSION) {
    SESSION = new Session({
      _id        : SESSION_ID,
      deviceToken: req.deviceToken,
      deviceImei : req.deviceImei,
      isMobile   : req.useragent?.isMobile,
      isDesktop  : req.useragent?.isDesktop,
      isBot      : `${req.useragent?.isBot}` === "postman",
      browser    : req.useragent?.browser,
      os         : req.useragent?.os,
      platform   : req.useragent?.platform,
      source     : req.useragent?.source,
    });
  }

  SESSION.set({
    deviceToken: req.deviceToken,
  });

  await SESSION.save();

  return SESSION_ID;
};

export const createExpireIn = (expireIn: number, type: "hours" | "minutes") => {
  if (type === "hours") {
    const seconds = expireIn * 60 * 60;
    return Math.floor(Date.now() / 1000) + seconds;
  } else {
    // convert expireIn to seconds
    const seconds = expireIn * 60;
    return Math.floor(Date.now() / 1000) + seconds;
  }
};