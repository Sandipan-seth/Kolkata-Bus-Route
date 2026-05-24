import mongoose, { model, models } from "mongoose";
import { IBusRoute } from "../types/BusType";

const busRouteSchema = new mongoose.Schema<IBusRoute>(
  {
    busNumber: { type: String, required: true },
    direction: { type: String, enum: ["UP", "DOWN"], required: true },
    stops: { type: [String], required: true },
  },
  { timestamps: true },
);

const BusRoute =
  models.BusRoute || model<IBusRoute>("BusRoute", busRouteSchema);

export default BusRoute;
