import {Document} from "mongoose";

export interface IBusRoute extends Document {
  busNumber: string;

  direction: "UP" | "DOWN";

  stops: string[];
}