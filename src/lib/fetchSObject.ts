import * as urlJoin from "url-join";

import { Fetcher } from "./fetcher";
import { formatApiVersion, SalesforceOptions } from "./salesforceOptions";

export class FetchSObject {
  fetcher: Fetcher;
  options: SalesforceOptions;

  static Create(fetcher: Fetcher, options: SalesforceOptions): FetchSObject {
    return new FetchSObject(fetcher, options);
  }

  constructor(fetcher: Fetcher, options: SalesforceOptions) {
    this.fetcher = fetcher;
    this.options = options;
  }

  private getBaseDataURL() {
    let apiVersion = formatApiVersion(this.options.apiVersion);
    return urlJoin(this.options.instanceURL, "services/data", apiVersion);
  }

  insert(sobjectName: string, body: any): Promise<any> {
    let fetchUrl = this.getSObjectUrl(sobjectName);

    let bodyJSON = JSON.stringify(body);
    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: bodyJSON,
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  private getSObjectUrl(sobjectName: string) {
    return urlJoin(this.getBaseDataURL(), "sobjects", sobjectName);
  }

  get(sobjectName: string, id: string): Promise<any> {
    let fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), id);

    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  update(sobjectName: string, id: string, body: any): Promise<any> {
    if (!id) {
      return Promise.reject(new Error("Invalid body for update, missing id"));
    }
    let bodyJSON = JSON.stringify(body);
    let fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), id);

    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: bodyJSON,
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  upsert(
    sobjectName: string,
    idFieldApiName: string,
    id: string,
    body: any
  ): Promise<any> {
    if (!id || !idFieldApiName) {
      return Promise.reject(
        new Error("Invalid body for upsert, missing id/idFieldApiName")
      );
    }
    let bodyJSON = JSON.stringify(body);
    let fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), idFieldApiName, id);

    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: bodyJSON,
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  delete(sobjectName: string, id: string): Promise<any> {
    let fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), id);

    let fetchOptions = {
      method: "DELETE",
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }
}
