import {
  Request,
  Response,
  createExpireIn,
  getSession,
} from "../../../middlewares/user";
// import { UserCreatedProducer, kafkaWrapper } from "@goodtechsoft/med-broker";
import { Method, ValidationError } from "@goodtechsoft/xs-micro-service";
import { SESSION_SCOPE } from "../../../constants/SESSION_SCOPE";
import { ERRORS, USER_STATUS } from "../../../constants";
import { signIn } from "../../../middlewares/sign";
import { User } from "../../../models/User";
import Joi from "joi";

const schema = Joi.object({
  lastname: Joi.string().max(100).required(),
  firstname: Joi.string().max(100).required(),
  email: Joi.string().max(255).required(),
  phone: Joi.string().length(8).optional(),
  password: Joi.string().max(255).required(),
  registerNo: Joi.string().max(45).required(),
});

export default Method.post(
  "/auth/register",
  schema,
  async (req: Request, res: Response) => {
    const { firstname, lastname, email, phone, password, registerNo } =
      req.body;

    const existEmail = await User.findOne({ email: email });
    if (existEmail)
      throw new ValidationError(
        ERRORS.EMAIL_ALREADY_EXISTS,
        "И-мэйл хаяг бүртгэлтэй байна."
      );
    const user = await User.findOne({ registerNo: registerNo });
    if (!user)
      throw new ValidationError(
        ERRORS.USER_NOTFOUND,
        "Бүртгэлгүй хэрэглэгч байна."
      );
    await user
      .set({
        firstname,
        lastname,
        phone,
        registerNo,
        email: `${email}`.toLowerCase(),
        username: `${phone}`.toLowerCase(),
        userStatus: USER_STATUS.VERIFIED,
        userStatusDate: new Date(),
      })
      .save();

    await user.createPassword(password);
    await user.save();

    // await new UserCreatedProducer(kafkaWrapper).send(user._id.toString(), {
    //   id: user._id.toString(),
    //   // customerId    : null, //zasna
    //   avatar: null,
    //   registerNo: user.registerNo,
    //   lastname: user.lastname,
    //   firstname: user.firstname,
    //   phone: user.phone,
    //   phoneSecond: null,
    //   email: user.email,
    //   userRole: null,
    //   userStatus: user.userStatus,
    //   userStatusDate: user.userStatusDate.toISOString(),
    //   createdAt: user.createdAt.toISOString(),
    //   updatedAt: user.updatedAt?.toISOString() || null,
    //   isActive: true,
    // });

    const SESSION_ID = await getSession(req);

    signIn(
      res,
      {
        user: user,
        expiresIn: createExpireIn(24 * 30, "hours"),
        sessionId: SESSION_ID.toString(),
      },
      SESSION_SCOPE.FORGOT
    );
  }
);
