class RevokeAccessTokenError extends Error {
  constructor(message: string, accessToken: string) {
    super(`${message}:\n\taccessToken: ${accessToken}`);
  }
}

interface FetchSalesforceRequestErrorContext {
  requestURL: string;
  requestOptions: RequestInit;
  responseBody: string;
  errorCode?: string;
  errorDescription?: string;
}

class FetchSalesforceRequestError extends Error {
  details: FetchSalesforceRequestErrorContext;

  constructor(message: string, details?: FetchSalesforceRequestErrorContext) {
    super(message);
    this.details = details;
  }
}

export {
  FetchSalesforceRequestErrorContext,
  FetchSalesforceRequestError,
  RevokeAccessTokenError,
};
