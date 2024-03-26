import * as querystring from "querystring";
import * as urlJoin from "url-join";

import { Fetcher } from "./fetcher";
import { formatApiVersion, SalesforceOptions } from "./salesforceOptions";

export class FetchQuery {
  fetcher: Fetcher;
  options: SalesforceOptions;

  static Create(fetcher: Fetcher, options: SalesforceOptions): FetchQuery {
    return new FetchQuery(fetcher, options);
  }

  constructor(fetcher: Fetcher, options: SalesforceOptions) {
    this.fetcher = fetcher;
    this.options = options;
  }

  private getBaseDataURL() {
    let apiVersion = formatApiVersion(this.options.apiVersion);
    return urlJoin(this.options.instanceURL, "services/data", apiVersion);
  }

  query(soqlQuery: string): Promise<any> {
    let encodedQuery = "?" + querystring.stringify({ q: soqlQuery });
    let fetchUrl = urlJoin(this.getBaseDataURL(), "query", encodedQuery);

    let fetchOptions: RequestInit = {
      method: "GET",
      cache: "no-cache",
    };
    return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
  }
}
