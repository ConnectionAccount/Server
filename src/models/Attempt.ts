import mongoose, { Document, Schema } from "mongoose";
import { ISession } from "./Session";
import { IUser } from "./User";

export interface IAttempt extends Document {
  user: string | IUser;
  session: string | ISession;
  ipAddress: string;
  attemptStatus: string;
  attemptStatusDate: Date
}

const AttemptSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref : "User"
  },
  session: {
    type: Schema.Types.ObjectId,
    ref : "Session"
  },
  ipAddress        : String,
  attemptStatus    : String,
  attemptStatusDate: Date
}, {
  timestamps: true
});

export const Attempt = mongoose.model<IAttempt>("Attempt", AttemptSchema);
