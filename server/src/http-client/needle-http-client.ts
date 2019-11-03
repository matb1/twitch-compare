import * as needle from 'needle';
import { HttpClient, HttpOptions, HttpResponse } from './http-client';

export class NeedleHttpClient implements HttpClient {

  public async get(url: string, options: HttpOptions = {}): Promise<HttpResponse> {

    const response: needle.NeedleResponse = await needle('get', url, null, options);

    return {
      body: response.body,
      headers: response.headers,
      status: response.statusCode
    };
  }

}