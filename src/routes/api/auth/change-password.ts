import { ForbiddenError, Method, ValidationError } from "@goodtechsoft/xs-micro-service";
import { Request, Response, createExpireIn, getSession } from "../../../middlewares/user";
import { SESSION_SCOPE } from "../../../constants/SESSION_SCOPE";
import { ERRORS } from "../../../constants";
import { signIn } from "../../../middlewares/sign";
import Joi from "joi";

const schema = Joi.object({
  oldPassword: Joi.string().max(255).optional().allow(null),
  password   : Joi.string().max(255).required(),
});

export default Method.post("/auth/change-password", schema, async (req: Request, res: Response) => {
  const { oldPassword, password } = req.body;

  if (req.sessionScope !== SESSION_SCOPE.AUTHORIZED && req.sessionScope !== SESSION_SCOPE.CHANGE_PASSWORD) throw new ForbiddenError(ERRORS.INVALID_SESSION_SCOPE);
  if (req.sessionScope === SESSION_SCOPE.AUTHORIZED && !(await req.user!.validatePassword(oldPassword))) throw new ValidationError(ERRORS.INVALID_OLD_PASSWORD, "Хуучин нууц үг буруу байна!");
  
  const newPassword = await req.user!.createPassword(password);

  console.log("newPassword: ", newPassword);

  req.user?.set({
    password: newPassword
  });

  await req.user!.save();

  const SESSION_ID = await getSession(req);

  signIn(
    res,
    {
      user     : req.user!,
      expiresIn: createExpireIn(24 * 30, "hours"),
      sessionId: SESSION_ID.toString(),
    },
    SESSION_SCOPE.AUTHORIZED
  );
});
