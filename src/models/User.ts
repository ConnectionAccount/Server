import { ValidationError } from "@goodtechsoft/xs-micro-service";
import mongoose, { Document, Schema } from "mongoose";
import { ERRORS, USER_STATUS } from "../constants";
import { ICustomer } from "./Customer";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  customer: string | ICustomer;
  email: string;
  username : string;
  password: string;
  isActive: boolean;
  registerNo: string;
  firstname: string;
  lastname: string;
  phone: string;
  expiryHours: number;
  userSuspended: boolean;
  passwordNeedChange: boolean;
  userStatusDate: Date;
  userStatus: string;
  userTerminated: boolean;
  passwordExpired: boolean;
  expiryDate: Date;
  deviceImei: string;
  deviceToken: string;
  sessionId: string;

  createdAt: Date;
  updatedAt: Date;
  validatePassword: (password: string) => Promise<boolean>;
  createPassword: (password: string) => Promise<string>;
}

const UserSchema = new Schema<IUser>({
  customer: {
    type: Schema.Types.ObjectId,
    ref : "Customer"
  },
  isActive: {
    type   : Boolean,
    default: true
  },
  phone     : String,
  firstname : String,
  registerNo: {
    type: String
  },
  email      : String,
  username   : String,
  password   : String,
  sessionId  : String,
  deviceImei : String,
  deviceToken: String,
  expiryHours: {
    type   : Number,
    default: 24
  },
  userSuspended: {
    type   : Boolean,
    default: false
  },
  userTerminated: {
    type   : Boolean,
    default: false
  },
  passwordExpired: {
    type   : Boolean,
    default: false
  },
  passwordNeedChange: {
    type   : Boolean,
    default: false
  },
  expiryDate: Date,
  userStatus: {
    type   : String,
    default: USER_STATUS.NEW
  }, 
  userStatusDate: {
    type   : Date,
    default: Date.now()
  },
}, {
  timestamps: true
});

UserSchema.methods.updatePassword = async function (password: string) {
  this.password = `some encrypts...${password}`;
  await this.save();
};

UserSchema.methods.validatePassword = async function (password: string) {
  if(!this.password) throw new ValidationError(ERRORS.BAD_REQUEST);
  const valid = await bcrypt.compare(password, this.password);
  return valid;
};

UserSchema.methods.createPassword = async function (password: string) {
  const SALT_ROUNDS = 10;

  const newPassword = await bcrypt.hash(password, SALT_ROUNDS);

  this.password = newPassword;

  return newPassword;
};
export const User = mongoose.model<IUser>("User", UserSchema);
