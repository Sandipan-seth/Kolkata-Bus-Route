import { Document } from "mongoose";

export interface IBusRoute extends Document {
  busNumber: string;

  direction: "up" | "down";

  isnonAc?: boolean;

  busType: "G" | "P";

  stops: string[];
}
