export interface Exercise {
  id: string;
  name: string;
  duration: string;
  calories: string;
  date?: Date;
  state?: 'completed' | 'cancelled' | null;
}
