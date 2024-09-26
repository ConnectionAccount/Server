import {
  Request,
  Response,
  createExpireIn,
  getSession,
} from "../../../middlewares/user";
// import { UserCreatedProducer, kafkaWrapper } from "@goodtechsoft/med-broker";
import { Method } from "@goodtechsoft/xs-micro-service";
import { SESSION_SCOPE } from "../../../constants/SESSION_SCOPE";
import { USER_STATUS } from "../../../constants";
import { signIn } from "../../../middlewares/sign";
import { User } from "../../../models/User";
import Joi from "joi";
import bcrypt from "bcryptjs";

const schema = Joi.object({
  username: Joi.string().max(100).required(),
  email: Joi.string().max(255).required(),
  phone: Joi.string().length(8).optional(),
  password: Joi.string().max(255).required(),
});

export default Method.post(
  "/auth/register",
  schema,
  async (req: Request, res: Response) => {
    const { username, email, phone, password } =
      req.body;

    const SALT_ROUNDS = 10;
    const _password = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User({
      username: `${username}`.toLowerCase(), 
      email: `${email}`.toLowerCase(), 
      phone, 
      password : _password,
      userStatusDate: new Date(),
      userStatus: USER_STATUS.NEW
    });
    await user.save();

    const SESSION_ID = await getSession(req);
    console.log("SESSION_ID     :       ", SESSION_ID)

    signIn(
      res,
      {
        user,
        expiresIn: createExpireIn(24 * 30, "hours"),
        sessionId: SESSION_ID.toString()
      },
      SESSION_SCOPE.FORGOT
    )
  }
);
