import type { ObjectId, Category } from "./common";

export interface Counsel {
  _id: ObjectId;
  title: string;
  thumbnail: string;
  description: string;
  content: any; // or stricter type if you know EditorJS block structure
  category: Category;
  related: ObjectId[]; // or `Counsel[]` if populated
  visits: number;
  createdAt: string; // or `Date` if parsed
}

export interface CounselShort {
  _id: ObjectId;
  title: string;
  thumbnail: string;
  description: string;
}