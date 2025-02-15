export interface Profile {
  id: string;
  userId: string;
  fullName: string | null;
  username: string;
  website: string | null;
  avatarUrl: string | null;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: Profile;
  articleId: string;
  userId: string;
  parentId?: string | null;
  replies?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image?: string;
  author: Profile;
  createdAt: string;
  likes: Array<{
    [x: string]: string; id: string 
}>;
  comments: Comment[];
  views: number;
}