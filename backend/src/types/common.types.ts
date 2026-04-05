export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
  }
  
  export interface PaginationQuery {
    page?: number;
    limit?: number;
  }