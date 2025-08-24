export interface InsertServiceFormData {
  name: string | null
  paperId: string | null
  color: string | null
  duplex: string | null
  image: File | null
  price: number | null
};

export interface UpdateServiceFormData {
  id: string | null
  name: string | null
  paperId: string | null
  color: string | null
  duplex: string | null
  image: File | null
  price: number | null
};
