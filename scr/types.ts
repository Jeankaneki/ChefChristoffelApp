// Define the possible course categories for a menu item.
export type CourseType = 'Starters' | 'Mains' | 'Desserts';

// Define the structure for a single menu item.
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: CourseType;
  price: string;
}

// Define the structure for the calculated statistics.
export interface Stats {
  totalItems: number;
  avgStarters: string;
  avgMains: string;
  avgDesserts: string;
}