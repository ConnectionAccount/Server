import { UnauthorizedError } from "@goodtechsoft/xs-micro-service";
import { ICustomer } from "../models/Customer";
import { db } from "@goodtechsoft/xs-mongodb";
import { Request, Response } from "./sign";
import { NextFunction } from "express";
import { User } from "../models/User";
import { ERRORS } from "../constants";
import { config } from "../config";
import jwt from "jsonwebtoken";

type JwtExpPayload = {
  uid: string;
  scp: string;
  sid: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const header = `${req.headers.authorization}`;
  const {
    "platform": platform 
  } = req.headers;
  try {
    let decoded;
    
    try {
      decoded = jwt.verify(header?.split(" ")[1], config.jwt.apiSecret) as JwtExpPayload;
      console.log(`🚀 ~ ${req.path} auth decoded`, decoded);
    } catch (err) {
      console.log(`🚀 ~ ${req.path} auth err`, err);
      throw new UnauthorizedError(ERRORS.NO_CREDENTIALS);
    }

    const user = await User.findOne({ _id: db.ObjectId(decoded?.uid) })
      .populate({
        model: "Customer",
        path : "customer"
      });
    if (!user) throw new UnauthorizedError(ERRORS.NO_CREDENTIALS);
    // if (user.sessionId.toString() !== decoded.sid) throw new UnauthorizedError(ERRORS.NO_CREDENTIALS);
    // if(user.customer) {
    //   if ((user.customer as ICustomer)?.type !== (platform as string)?.toUpperCase()) 
    //   throw new UnauthorizedError(ERRORS.NO_CREDENTIALS); 
    // }

    req.user = user;
    req.sessionScope = decoded.scp;
    
    console.log(`🚀 ~ ${req.path} auth middleware done`);
    next();
  } catch (err) {
    next(err);
  }
};
export { Request };


