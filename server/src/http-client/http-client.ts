export interface HttpResponse {
  status: number;
  body: any;
  headers: any;
}

export interface HttpOptions {
  timeout?: number;
  headers?: {};
}

export interface HttpClient {
  get(url: string, options?: HttpOptions): Promise<HttpResponse>;
}