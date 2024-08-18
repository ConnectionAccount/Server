import {
  Request,
  Response,
  createExpireIn,
  getSession,
} from "../../../middlewares/user";
// import { AuthChangeProducer, kafkaWrapper } from "@goodtechsoft/med-broker";
import { Method, UnauthorizedError } from "@goodtechsoft/xs-micro-service";
import { SESSION_SCOPE } from "../../../constants/SESSION_SCOPE";
import { ATTEMPT_STATUS, ERRORS } from "../../../constants";
import { signIn } from "../../../middlewares/sign";
import { Attempt } from "../../../models/Attempt";
import { User } from "../../../models/User";
import Joi from "joi";
import { ICustomer } from "../../../models/Customer";

const schema = Joi.object({
  email: Joi.string().max(255).required(),
  password: Joi.string().max(255).required(),
});

type IBody = {
  email: string;
  password: string;
};

export default Method.post(
  "/auth/login",
  schema,
  async (req: Request, res: Response) => {
    const { email, password }: IBody = req.body;
    const {
      platform: platform, // set, mine
    } = req.headers;
    const user = await User.findOne({ email: email }).populate({
      model: "Customer",
      path: "customer",
    });
    if (!user) throw new UnauthorizedError(ERRORS.AUTHENTICATION_FAILED);
    const SESSION_ID = await getSession(req);
    if (user.customer) {
      if (
        (user.customer as ICustomer)?.type !==
        (platform as string)?.toUpperCase()
      )
        throw new UnauthorizedError(ERRORS.NO_CREDENTIALS);
    }
    try {
      if (!(await user.validatePassword(password)))
        throw new UnauthorizedError(ERRORS.AUTHENTICATION_FAILED);
      await new Attempt({
        user: user,
        session: SESSION_ID,
        ipAddress: req.useragent?.geoIp.ipAddress,
        attemptStatus: ATTEMPT_STATUS.SUCCESS,
        attemptStatusDate: new Date(),
      }).save();

      await user.save();

      // await new AuthChangeProducer(kafkaWrapper).send(user._id.toString(), {
      //   id: user._id.toString(),
      //   sessionId: SESSION_ID.toString(),
      //   createdAt: new Date().toISOString(),
      // });
      signIn(
        res,
        {
          user: user,
          expiresIn: createExpireIn(24 * 30, "hours"),
          sessionId: SESSION_ID.toString(),
        },
        SESSION_SCOPE.AUTHORIZED
      );
    } catch (err) {
      await new Attempt({
        user: user,
        session: SESSION_ID,
        ipAddress: req.useragent?.geoIp.ipAddress,
        attemptStatus: ATTEMPT_STATUS.FAILED,
        attemptStatusDate: new Date(),
      }).save();

      throw err;
    }
  }
);
