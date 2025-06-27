export type Category =
  | 'Web Development'
  | 'Data Science'
  | 'Machine Learning'
  | 'Mobile Development'
  | 'Game development';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ObjectId = string; // You can refine this if you're using a Mongo driver that enforces `ObjectId` shape
