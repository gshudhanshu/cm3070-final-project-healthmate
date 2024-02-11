export interface SearchParams {
  name?: string;
  location?: string;
  speciality?: string[];
  priceRange?: [number, number];
  experience?: string[];
  qualifications?: string[];
  languages?: string[];
  page?: number;
  [key: string]: any;
}
