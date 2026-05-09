import mongoose, { Document, Schema } from "mongoose";

export interface IHouse extends Document {
  ownerId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  locationName: string;
  latitude: number;
  longitude: number;
  price: number;
  size: string;
  images: string[];
  status: "available" | "rented";
  createdAt: Date;
  updatedAt: Date;
}

const houseSchema = new Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    locationName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model<IHouse>("House", houseSchema);

export default House;
