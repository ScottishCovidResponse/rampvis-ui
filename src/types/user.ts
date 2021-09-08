export interface User {
  id: string;
  email: string;
  name: string;
  bookmarks: string[];
  [key: string]: any;
}
