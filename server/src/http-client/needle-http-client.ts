import * as needle from 'needle';
import { injectable } from './../inversify.decorators';
import { HttpClient, HttpOptions, HttpResponse } from './http-client';

export const NeedleHttpClientToken = Symbol('NeedleHttpClient');

@injectable()
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