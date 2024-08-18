import { Request, Response } from "../../../middlewares/user";
import { Method } from "@goodtechsoft/xs-micro-service";

export default Method.get("/auth/me", null, async (req: Request, res: Response) => {
  res.json({
    ...req.user!.toJSON(),
    password: undefined
  });
});
