import type { ObjectId, Category, CourseLevel } from "./common";

export interface CourseTopic {
  head: string;
  body: string;
}

export interface CourseQuestion {
  question: string;
  answer: string;
}

export interface CourseContentItem {
  itemId: ObjectId;
  itemType: 'video' | 'article' | 'quiz';
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
  content: CourseContentItem[];
  related: CourseShort[]; // or Course[] if populated
  createdAt: string;
}

export interface CourseShort {
  _id: string
  title: string
  shortDesc: string
  thumbnail: string
}

