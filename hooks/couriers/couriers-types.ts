export interface Courier {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  area: string;
  created_at: string;
  profile: {
    avatar_url: string;
  };
}