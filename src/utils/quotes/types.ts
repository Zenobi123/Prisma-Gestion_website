
export type QuoteRequest = {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  service?: string | null;
  details?: string;
  created_at?: string;
  read?: boolean;
};
