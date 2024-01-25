export interface DoctorProfile {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  phone: string | null;
  hospital_address: string | null;
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
      id: string;
      name: string;
      university: string;
    },
  ];
  languages: [
    {
      id: string;
      name: string;
    },
  ];
}
