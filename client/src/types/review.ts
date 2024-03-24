export interface Review {
  id?: number;
  patient_name?: string;
  rating: number;
  comment: string;
  date_created?: string;
  conversation_id: number;
}
