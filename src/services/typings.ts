export interface IResponse<TItem> {
  $id: string;
  $values: TItem[];
}

export interface ApiResponse {
  status: string | number;
  message?: string;
  data?: any;
  errors?: any;
}