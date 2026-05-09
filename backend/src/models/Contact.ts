import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  houseId: mongoose.Schema.Types.ObjectId;
  senderName: string;
  message: string;
  contactInfo: string;
  createdAt: Date;
}

const contactSchema = new Schema(
  {
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "House",
    },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    contactInfo: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
