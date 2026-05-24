import { Document } from "mongoose";

export interface IBusRoute extends Document {
  busNumber: string;

  direction: "UP" | "DOWN";

  busType: "G" | "P";

  stops: string[];
}
