import { HttpClient, HttpOptions, HttpResponse } from './http-client';

export class HttpClientMock implements HttpClient {

  public getCallCount: number = 0;
  public getRecordedParameter: { url: string, options: HttpOptions };
  public getRecordedParameters: Array<{ url: string, options: HttpOptions }> = [];
  public getError: any;
  public getReturnValue: HttpResponse;
  public getReturnValues: HttpResponse[];

  public async get(url: string, options?: HttpOptions): Promise<HttpResponse> {
    this.getCallCount++;
    this.getRecordedParameter = { url, options };
    this.getRecordedParameters.push({ url, options });

    return new Promise<HttpResponse>((resolve, reject) => {
      if (this.getError) {
        reject(this.getError);
      } else {
        resolve(this.getReturnValues ? this.getReturnValues[this.getCallCount - 1] : this.getReturnValue);
      }
    });
  }

}