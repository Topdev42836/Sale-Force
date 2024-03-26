import * as querystring from "querystring";
import * as urlJoin from "url-join";

import { FetchApexREST } from "./fetchApexREST";
import { FetchChatter } from "./fetchChatter";
import { Fetcher } from "./fetcher";
import { FetchQuery } from "./fetchQuery";
import { FetchSObject } from "./fetchSObject";
import { FetchUserInfo } from "./fetchUserInfo";
import { SalesforceOptions, withDefaults } from "./salesforceOptions";

export interface AuthorizationOptionalParameters {
  scope?: string;
  state?: string;
  display?: string;
  login_hint?: string;
  nonce?: string;
  prompt?: string;
}

export class FetchSalesforce {
  options: SalesforceOptions;
  fetcher: Fetcher;
  fetchSObject: FetchSObject;
  fetchQuery: FetchQuery;
  fetchChatter: FetchChatter;
  fetchApexREST: FetchApexREST;
  fetchUserInfo: FetchUserInfo;

  constructor(options: SalesforceOptions) {
    this.options = withDefaults(options);
    this.fetcher = Fetcher.Create(this.options);
    this.fetchSObject = FetchSObject.Create(this.fetcher, this.options);
    this.fetchQuery = FetchQuery.Create(this.fetcher, this.options);
    this.fetchChatter = FetchChatter.Create(this.fetcher, this.options);
    this.fetchApexREST = FetchApexREST.Create(this.fetcher, this.options);
    this.fetchUserInfo = FetchUserInfo.Create(this.fetcher, this.options);
  }

  buildAuthorizationURL(
    authorizationOptionalParameters: AuthorizationOptionalParameters
  ): string {
    let parameters = Object.assign(
      {
        response_type: this.options.authorizationResponseType,
        client_id: this.options.clientID,
        redirect_uri: this.options.redirectUri,
      },
      authorizationOptionalParameters
    );
    let encodedQuery = "?" + querystring.stringify(parameters);

    return urlJoin(this.getAuthorizationServiceURL(), encodedQuery);
  }

  private getAuthorizationServiceURL() {
    let authorizationServiceURL = this.options.authorizationServiceURL;
    if (!authorizationServiceURL) {
      authorizationServiceURL = urlJoin(
        this.options.instanceURL,
        "/services/oauth2/authorize"
      );
    }
    return authorizationServiceURL;
  }
}
