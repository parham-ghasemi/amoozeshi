import type { ObjectId } from "./common";

export interface Admin {
  _id: ObjectId;
  userName: string;
  phoneNumber: number;
  hashedPassword: string;
}
