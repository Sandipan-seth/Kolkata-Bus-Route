import mongoose, { model, models } from "mongoose";
import { IBusRoute } from "../types/BusType";

const busRouteSchema = new mongoose.Schema<IBusRoute>(
  {
    busNumber: { type: String, required: true },
    busType: { type: String, enum: ["G", "P"], required: true },
    isnonAc: { type: Boolean, default: true },
    direction: { type: String, enum: ["up", "down"], required: true },
    stops: { type: [String], required: true },
  },
  { timestamps: true },
);

const BusRoute =
  models.BusRoute || model<IBusRoute>("BusRoute", busRouteSchema);

export default BusRoute;