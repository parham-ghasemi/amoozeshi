export interface PodcastShort {
  _id: string;
  title: string;
  thumbnail: string;
  listens: number;
  createdAt: string;
}


export interface Podcast {
  _id: string;
  title: string;
  thumbnail: string;
  content: string; // URL to the audio file
  shortDesc: string;
  longDesc: string | { blocks: Block[] }; // Can be a JSON string or parsed object
  related: string[]; // Array of related podcast IDs
}
export interface Block {
  type: "header" | "paragraph" | "list" | "image";
  data: {
    level?: number; // For headers
    text?: string; // For headers and paragraphs
    style?: "unordered" | "ordered" | "checklist"; // For lists
    items?: Array<{ content: string; meta?: { checked: boolean } }>; // For lists
    file?: { url: string }; // For images
    caption?: string; // For images
  };
}