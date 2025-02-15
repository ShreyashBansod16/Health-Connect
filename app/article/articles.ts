
export interface Article {
  date: string | undefined;

  id: string;

  title: string;

  excerpt: string;

  image?: string;

  category: string;

  author: {

    username: string;

  };

  createdAt: string;

}

 
  
  export const categories = ["All", "Technology", "Mental Health", "Nutrition", "Research", "Fitness"]
  
  