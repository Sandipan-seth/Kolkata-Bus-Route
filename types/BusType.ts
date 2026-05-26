import { Document } from "mongoose";

export interface IBusRoute extends Document {
  busNumber: string;

  direction: "UP" | "DOWN";

  isnonAc ?: boolean;

  busType: "G" | "P";

  stops: string[];
}
