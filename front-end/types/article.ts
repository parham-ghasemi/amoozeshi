import type { ObjectId, Category } from "./common";

export interface Article {
  _id: ObjectId;
  title: string;
  thumbnail: string;
  description: string;
  content: any; // or stricter type if you know EditorJS block structure
  category: Category;
  related: ObjectId[]; // or `Article[]` if populated
  visits: number;
  createdAt: string; // or `Date` if parsed
}

export interface ArticleShort {
  _id: ObjectId;
  title: string;
  thumbnail: string;
  visits: number;
  createdAt: string;
}