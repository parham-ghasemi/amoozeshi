import type { ObjectId, Category } from "./common";

export interface Video {
  _id: ObjectId;
  title: string;
  shortDesc: string;
  thumbnail: string;
  content: string;
  category: Category;
  related: ObjectId[]; // or Article[] if populated
  createdAt: string;
}
