export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'MODO' | 'ADMIN';
  subscriptions: Category[];
  favorites: Category[];
}

export interface Category {
  id: number;
  name: string;
  parent?: Category;
  children: Category[];
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  category: Category;
  firstStep: DecisionStep;
}

export interface DecisionStep {
  id: number;
  text: string;
  imageUrl?: string;
  isFinal: boolean;
  choices: Choice[];
}

export type Choice = NavigationChoice | UrlChoice | FinalChoice;

export interface BaseChoice {
  id: number;
  text: string;
  decisionStep: DecisionStep;
}

export interface NavigationChoice extends BaseChoice {
  nextStep: DecisionStep;
}

export interface UrlChoice extends BaseChoice {
  url: string;
}

export interface FinalChoice extends BaseChoice {
  conclusionText: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  type: 'INFO' | 'ALERT' | 'UPDATE';
  creationDate: string; // LocalDateTime is serialized as a string
  author: User;
  category?: Category;
}

export interface Notification {
  id: number;
  message: string;
  creationDate: string; // LocalDateTime is serialized as a string
  isRead: boolean;
  user: User;
  news: News;
}

export interface Image {
  id: number;
  filename: string;
  url: string;
  uploadedAt: string; // LocalDateTime is serialized as a string
}
