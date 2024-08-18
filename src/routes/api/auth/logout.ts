// import { AuthEndProducer, kafkaWrapper } from "@goodtechsoft/med-broker";
import { Method } from "@goodtechsoft/xs-micro-service";
import { Response } from "express";
import { Request } from "../../../middlewares/auth";
import { signOut } from "../../../middlewares/sign";

export default Method.post("/auth/logout", null, async (req: Request, res: Response) => {
  signOut(res);
  // new AuthEndProducer(kafkaWrapper).send(req.user?._id.toString(), {
  //   _id      : req.user?._id.toString(),
  //   isActive : false,
  //   updatedAt: new Date().toISOString()
  // });
}); 