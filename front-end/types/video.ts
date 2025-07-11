import type { ObjectId, Category } from "./common";

export interface Video {
  _id: ObjectId;
  title: string;
  shortDesc: string;
  longDesc: any;
  thumbnail: string;
  content: string;
  category: Category;
  related: ObjectId[];
  createdAt: string;
}

export type VideoShort = {
  _id: string
  title: string
  thumbnail: string
  visits: number
  createdAt: string
}
