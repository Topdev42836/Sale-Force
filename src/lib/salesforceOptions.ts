export interface SalesforceOptions {
  instanceURL?: string;
  clientID?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  apiVersion?: number;
  sfdcCommunityID?: string;
  authorizationServiceURL?: string;
  authorizationResponseType?: string;
  tokenServiceURL?: string;
  revokeServiceURL?: string;
  redirectUri?: string;
  logLevel?: string;
}

let defaultOptions = {
  apiVersion: 38,
  authorizationResponseType: "token",
};

export function withDefaults(options: SalesforceOptions): SalesforceOptions {
  let defaultOptionsCopy: any = Object.assign({}, defaultOptions);
  return Object.assign(defaultOptionsCopy, options);
}

export function formatApiVersion(apiVersion: number): string {
  return "v" + Number(apiVersion).toFixed(1);
}
