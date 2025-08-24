export interface InsertPaperFormData {
  brand: string | null;
  size: string | null;
  type: string | null;
  image: File | null;
  price: number | null;
  sheets: number | null;
}

export interface UpdatePaperFormData {
  id: string | null;
  brand: string | null;
  size: string | null;
  type: string | null;
  image: File | null;
  price: number | null;
  sheets: number | null;
}
