export interface HttpResponse {
  status: number;
  body: any;
  headers: any;
}

export interface HttpOptions {
  timeout?: number;
  headers?: {};
}

// This interface could in the future expose the other HTTP methods (POST, PUT, PATCH, DELETE),
// but only GET is needed for now
export interface HttpClient {
  get(url: string, options?: HttpOptions): Promise<HttpResponse>;
}