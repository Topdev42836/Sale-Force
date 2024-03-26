import * as urlJoin from "url-join";

import { Fetcher } from "./fetcher";
import { formatApiVersion, SalesforceOptions } from "./salesforceOptions";

export class FetchChatter {
  fetcher: Fetcher;
  options: SalesforceOptions;

  static Create(fetcher: Fetcher, options: SalesforceOptions): FetchChatter {
    return new FetchChatter(fetcher, options);
  }

  constructor(fetcher: Fetcher, options: SalesforceOptions) {
    this.fetcher = fetcher;
    this.options = options;
  }

  private getBaseChatterURL() {
    let apiVersion = formatApiVersion(this.options.apiVersion);
    let communitiesPath = "";

    if (this.options.sfdcCommunityID) {
      communitiesPath = urlJoin(
        "connect/communities",
        this.options.sfdcCommunityID
      );
    }
    return urlJoin(
      this.options.instanceURL,
      "services/data",
      apiVersion,
      communitiesPath,
      "chatter"
    );
  }

  retrieve(resource: string, connectBearerUrls?: boolean): Promise<any> {
    let fetchUrl = urlJoin(this.getBaseChatterURL(), resource);

    let fetchOptions: RequestInit = {
      method: "GET",
      cache: "no-cache",
    };

    if (connectBearerUrls) {
      fetchOptions.headers = {
        "X-Connect-Bearer-Urls": "true",
      };
    }

    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  create(resource: string, body: any): Promise<any> {
    let fetchUrl = urlJoin(this.getBaseChatterURL(), resource);

    let bodyJSON = JSON.stringify(body);
    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: bodyJSON,
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  update(resource: string, id: string, body: any): Promise<any> {
    if (!id) {
      return Promise.reject(new Error("Invalid body for update, missing id"));
    }
    let fetchUrl = urlJoin(this.getBaseChatterURL(), resource, id);

    let bodyJSON = JSON.stringify(body);
    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: bodyJSON,
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }

  delete(resource: string, id: string): Promise<any> {
    let fetchUrl = urlJoin(this.getBaseChatterURL(), resource, id);

    let fetchOptions = {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }
}
