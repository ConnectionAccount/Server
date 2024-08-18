import { Request, Response, createExpireIn, getSession } from "../../../middlewares/user";
import { Method, NotfoundError } from "@goodtechsoft/xs-micro-service";
import { SESSION_SCOPE } from "../../../constants/SESSION_SCOPE";
import { ERRORS } from "../../../constants";
import { User } from "../../../models/User";
import { signIn } from "../../../middlewares/sign";
import Joi from "joi";

const schema = Joi.object({
  email: Joi.string().max(255).required(),
});

export default Method.post("/auth/forgot", schema, async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) throw new NotfoundError(ERRORS.USER_NOTFOUND,"Хэрэгэлэгч олдсонгүй.");
  const SESSION_ID = await getSession(req);
  
  signIn(
    res,
    {
      user     : user,
      expiresIn: createExpireIn(3, "minutes"),
      sessionId: SESSION_ID.toString(),
    },
    SESSION_SCOPE.FORGOT
  );
});
