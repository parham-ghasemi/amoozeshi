import type { ArticleShort } from "./article";
import type { VideoShort } from "./video";
import type { ObjectId, Category, CourseLevel } from "./common";

export interface CourseTopic {
  head: string;
  body: string;
}

export interface CourseQuestion {
  question: string;
  answer: string;
}

export interface CourseContent {
  _id: ObjectId;
  itemId : ArticleShort | VideoShort;
  itemType: "Article" | "Video";
}

export interface Course {
  _id: ObjectId;
  title: string;
  shortDesc: string;
  thumbnail: string;
  longDesc: string;
  category: Category;
  time: number;
  level: CourseLevel;
  goal: string;
  topics: CourseTopic[];
  questions: CourseQuestion[];
  content: CourseContent[];
  related: CourseShort[];
  createdAt: string;
}

export interface CourseShort {
  _id: string
  title: string
  shortDesc: string
  thumbnail: string
}

