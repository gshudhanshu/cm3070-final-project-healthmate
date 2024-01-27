export interface DoctorProfile {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  phone: string | null;
  hospital_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  experience: string | null;
  profile_pic: string | null;
  cost: string | null;
  currency: string | null;
  description: string | null;
  specialties: [
    {
      id: string;
      name: string;
    },
  ];
  qualifications: [
    {
      name: string;
      university: string;
      start_year: number;
      finish_year: number;
    },
  ];
  languages: [
    {
      name: string;
      level: string;
    },
  ];
  reviews: [
    {
      patient_name: number;
      rating: number;
      comment: string;
      date_created: string;
    },
  ];
}
