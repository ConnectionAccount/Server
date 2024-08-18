import { Request, Response, createExpireIn, getSession } from "../../../middlewares/user";
import { ERRORS, OTP_METHOD, OTP_STATUS, USER_STATUS } from "../../../constants";
import { Method, ValidationError } from "@goodtechsoft/xs-micro-service";
import { SESSION_SCOPE } from "../../../constants/SESSION_SCOPE";
import { Otp } from "../../../models/Otp";
import { signIn } from "../../../middlewares/sign";
import Joi from "joi";

const schema = Joi.object({
  otpCode  : Joi.string().max(6).required(),
  otpMethod: Joi.string().valid(OTP_METHOD.FORGOT, OTP_METHOD.REGISTER).required(),
});
export default Method.post("/otp/verify", schema, async (req: Request, res: Response) => {
  const { otpCode, otpMethod } = req.body;
  const otp = await Otp.findOne({ otpMethod, user: req.user, otpStatus: OTP_STATUS.NEW }).sort({ _id: -1 });
  if (!otp) throw new ValidationError(ERRORS.INVALID_OTP_CODE, "Баталгаажуулах код буруу байна!");

  if (!(await otp.validateCode(otpCode))) throw new ValidationError(ERRORS.INVALID_OTP_CODE, "Баталгаажуулах код буруу байна!");

  if (!(await otp.validateExpiryIn())) throw new ValidationError(ERRORS.OTP_CODE_EXPIRE_IN, "Баталгаажуулах кодны идэвхтэй хугацаа дууссан байна!");

  otp.set({
    otpStatus    : OTP_STATUS.SUCCESS,
    otpStatusDate: new Date(),
  });

  await otp.save();

  await Otp.updateMany(
    {
      user     : req.user,
      otpStatus: OTP_STATUS.NEW,
    },
    {
      otpStatus    : OTP_STATUS.EXPIRED,
      otpStatusDate: new Date(),
    }
  );
  switch (otpMethod) {
    case OTP_METHOD.REGISTER: {
      await req.user
        ?.set({
          userStatus    : USER_STATUS.VERIFIED,
          userStatusDate: new Date(),
        })
        .save();

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

      break;
    }
    case OTP_METHOD.FORGOT: {
      const SESSION_ID = await getSession(req);
      signIn(
        res,
        {
          user     : req.user!,
          expiresIn: createExpireIn(24 * 30, "hours"),
          sessionId: SESSION_ID.toString(),
        },
        SESSION_SCOPE.CHANGE_PASSWORD
      );

      break;
    }
    default:
      throw new ValidationError(ERRORS.INVALID_OTP_METHOD);
  }
});
