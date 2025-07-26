export type Category = {name:string}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ObjectId = string; // You can refine this if you're using a Mongo driver that enforces `ObjectId` shape
