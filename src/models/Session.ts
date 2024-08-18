import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  sessionID: string;
  deviceToken: string;
  deviceImei: string;
  isMobile: boolean;
  isDesktop: boolean;
  isBot: boolean;
  browser: string;
  version: string;
  os: string;
  platform: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema({
  sessionID  : String,
  deviceToken: String,
  deviceImei : String,
  isMobile   : Boolean,
  isDesktop  : Boolean,
  isBot      : Boolean,
  browser    : String,
  version    : String,
  os         : String,
  platform   : String,
  source     : String
}, {
  timestamps: true
});

export const Session = mongoose.model<ISession>("Session", SessionSchema);
