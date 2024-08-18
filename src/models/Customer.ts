import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  type: string; // BUYER, MINE, CUSTOMS, TRANSPORT
  name: string;
  receiptNoPrefix: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  type: {
    type: String,
  },
  name: {
    type: String,
  },
  receiptNoPrefix: {
    type: String
  },
},
{
  timestamps: true
});

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
