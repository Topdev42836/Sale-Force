import * as urlJoin from "url-join";

import { Fetcher } from "./fetcher";
import { SalesforceOptions } from "./salesforceOptions";

export class FetchApexREST {
  fetcher: Fetcher;
  options: SalesforceOptions;

  static Create(fetcher: Fetcher, options: SalesforceOptions): FetchApexREST {
    return new FetchApexREST(fetcher, options);
  }

  constructor(fetcher: Fetcher, options: SalesforceOptions) {
    this.fetcher = fetcher;
    this.options = options;
  }

  private getBaseApexRESTURL() {
    return urlJoin(this.options.instanceURL, "services", "apexrest");
  }

  get(endpointPath: string): Promise<any> {
    let fetchUrl = urlJoin(this.getEndpointURL(endpointPath));

    let fetchOptions = {
      method: "GET",
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  private getEndpointURL(endpointPath: string) {
    return urlJoin(this.getBaseApexRESTURL(), endpointPath);
  }

  post(endpointPath: string, body: any): Promise<any> {
    let fetchUrl = this.getEndpointURL(endpointPath);

    let bodyJSON = JSON.stringify(body);
    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: bodyJSON,
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  patch(endpointPath: string, body: any): Promise<any> {
    let bodyJSON = JSON.stringify(body);
    let fetchUrl = this.getEndpointURL(endpointPath);

    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: bodyJSON,
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  delete(endpointPath: string): Promise<any> {
    let fetchUrl = this.getEndpointURL(endpointPath);

    let fetchOptions = {
      method: "DELETE",
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }
}
