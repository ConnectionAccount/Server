import { ERRORS, OTP_CHARSET, OTP_METHOD, OTP_STATUS } from "../../../constants";
import { Method, NotfoundError } from "@goodtechsoft/xs-micro-service";
import { Request, Response, createExpireIn } from "../../../middlewares/user";
import { User } from "../../../models/User";
import { Otp } from "../../../models/Otp";
import mailer from "../../../3dparty/mailer";
import Joi from "joi";

const schema = Joi.object({
  otpMethod: Joi.string().valid(OTP_METHOD.FORGOT, OTP_METHOD.REGISTER).required(),
  email    : Joi.string().max(255).required(),
});

export default Method.get("/otp", schema, async (req: Request, res: Response) => {
  const { email, otpMethod } = req.query as { email: string; otpMethod: string };

  const user = await User.findOne({ email });
  if (!user) throw new NotfoundError(ERRORS.USER_NOTFOUND, "Бүртгэлтэй хэрэглэгч олдсогүй");

  const otp = new Otp({
    user         : req.user,
    otpCharset   : OTP_CHARSET.NUMERIC,
    otpMethod    : otpMethod,
    otpMethodSent: new Date(),
    otpStatus    : OTP_STATUS.NEW,
    otpStatusDate: new Date(),
  });

  const code = await otp.generateCode();

  await otp.save();

  mailer.sendOtp(email, { code });

  const chars = email.split("@");
  const expireAt = createExpireIn(3, "minutes");
  res.json({
    otpMethod : otp.otpMethod,
    otpCharset: otp.otpCharset,
    otpCode   : code,
    expiryIn  : new Date(expireAt * 1000),
    message   : `Таны ${email.substr(0, 2)}****@${chars[1]} Таны э-мэйл хаягт илгээсэн 6 оронтой кодыг оруулна уу!`,
  });
});
