export interface CustomerPayload {
  name: string;
  phone: string;
  firm: string;
  balance: number;
  address: string;
}

export interface ApiResponse {
  status: number;
  data: any;
}
