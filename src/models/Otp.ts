import { ValidationError } from "@goodtechsoft/xs-micro-service";
import mongoose, { Document, Schema } from "mongoose";
import { ERRORS, OTP_CHARSET } from "../constants";
import { IUser } from "./User";
import randomString from "randomstring";
import bcrypt from "bcryptjs";
import moment from "moment";

export interface IOtp extends Document {
  user: string | IUser;
  otpMethod    : string;
  otpCharset   : string;
  otpCode      : string;
  otpMethodSent: Date;
  otpStatus    : string;
  otpStatusDate: Date;
  phone?:string;
  email?: string;
  validateCode: (code: string) => Promise<boolean>;
  validateExpiryIn: () => Promise<boolean>;
  generateCode: () => Promise<string>;
}

const OtpSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref : "User"
  },
  phone        : String,
  email        : String,
  otpMethod    : String,
  otpCharset   : String,
  otpCode      : String,
  otpMethodSent: Date,
  otpStatus    : String,
  otpStatusDate: Date
}, {
  timestamps: true
});

OtpSchema.methods.validateCode = async function (otpCode: string) {
  if (!await bcrypt.compare(otpCode, this.otpCode)) 
    return false;

  return true;
};

OtpSchema.methods.validateExpiryIn = async function () {
  const duration = moment.duration(moment(this.otpMethodSent).add(3, "minute").diff(moment(new Date())));
  if (duration.asSeconds() <= 0) 
    return false;

  return true;
};

OtpSchema.methods.generateCode = async function () {
  const SALT_ROUNDS = 10;

  let rand;

  switch (this.otpCharset) {
    case OTP_CHARSET.ALPHABETIC: {
      rand = randomString.generate({ length: 50, charset: "alphabetic" });
      break;
    }
    case OTP_CHARSET.NUMERIC: {
      rand = randomString.generate({
        length : 6,
        charset: "numeric"
      }); // Math.round(1000 + Math.random() * 899999);
      break;
    }
    default:
      throw new ValidationError(ERRORS.INVALID_OTP_CHARSET);
  }

  const OTP_CODE = await bcrypt.hash(rand.toString(), SALT_ROUNDS);

  this.otpCode = OTP_CODE;

  return rand;
};

export const Otp = mongoose.model<IOtp>("Otp", OtpSchema);
