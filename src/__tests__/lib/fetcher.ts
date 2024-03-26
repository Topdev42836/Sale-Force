import * as fetchMock from "fetch-mock";

import { Fetcher } from "../../lib/fetcher";
import { SalesforceOptions } from "../../lib/salesforceOptions";
import { withRequiredSalesforceOptions } from "./salesforceOptions";

describe("fetcher", () => {
  let options: SalesforceOptions;
  let fetcher: Fetcher;

  beforeEach(() => {
    options = withRequiredSalesforceOptions();
    fetchMock.mock("https://instanceURL/requiredtest/services/oauth2/token", {
      access_token: "refreshedAccessToken",
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe("constructor", () => {
    describe("without accessToken", () => {
      beforeEach(() => {
        fetcher = Fetcher.Create(options);
      });

      it("initializes", () => {
        expect(fetcher).toBeDefined();
        expect(fetcher.options).toEqual(options);
        expect(fetcher.isRefreshingAccessToken).toBe(false);
        expect(fetcher.logger).toBeDefined();
        expect(fetcher.pendingRequests).toEqual([]);
      });
    });

    describe("with accessToken", () => {
      beforeEach(() => {
        options.accessToken = "populated accessToken";
        fetcher = Fetcher.Create(options);
      });

      it("initializes with undefined accessToken", () => {
        expect(fetcher).toBeDefined();
        expect(fetcher.options).toBeDefined();
        expect(fetcher.options.accessToken).toBeDefined();
        expect(fetcher.isRefreshingAccessToken).toBe(false);
      });
    });
  });

  describe("getAccessToken", () => {
    beforeEach(() => {
      fetcher = Fetcher.Create(options);
    });

    it("if it exists, it returns it", () => {
      let expectedAccessToken = "existingAccessToken";
      fetcher.options.accessToken = expectedAccessToken;

      return fetcher.getAccessToken().then(actualAccessToken => {
        expect(actualAccessToken).toEqual(expectedAccessToken);
      });
    });

    it("if it does not exist and we have a refresh token, it attempts to refresh it", () => {
      let expectedAccessToken = "refreshedAccessToken";
      fetcher.options.accessToken = expectedAccessToken;

      return fetcher.getAccessToken().then(actualAccessToken => {
        expect(actualAccessToken).toEqual(expectedAccessToken);
        expect(fetcher.isRefreshingAccessToken).toBe(false);
      });
    });

    it("if it does not exist and we do not have a refresh token, the promise is rejected", () => {
      fetcher.options.accessToken = null;
      fetcher.options.refreshToken = null;

      return fetcher.getAccessToken().catch((err: any) => {
        expect(err.message).toEqual("No access token");
      });
    });
  });

  describe.only("fetchJSON", () => {
    let validRequestURL = "https://some/request/url";
    let validRequestWithHeaders = "validRequestWithHeaders";
    let errorResponse = "errorResponse";
    let invalidSessionResponse = "invalidSessionResponse";

    beforeEach(() => {
      // options.logLevel = 'DEBUG';
      fetcher = Fetcher.Create(options);
      fetcher.options.accessToken = "authorizedToken";
    });

    afterEach(() => {
      fetchMock.restore();
    });

    function mockValidRequestWithHeaders() {
      let mockOptions = {
        name: validRequestWithHeaders,
        headers: {
          "Content-Type": "application/json",
          "Some-Other-Header": "cool!",
          Authorization: "Authorization: Bearer authorizedToken",
        },
        method: "PATCH",
      };
      fetchMock.mock(
        validRequestURL,
        {
          allGood: true,
        },
        mockOptions
      );
    }

    function mockErrorResponse() {
      let mockOptions = {
        name: errorResponse,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Authorization: Bearer authorizedToken",
        },
        method: "GET",
      };

      fetchMock.mock(
        validRequestURL,
        {
          status: 500,
          headers: {
            "Content-type": "application/json",
          },
          body: [
            {
              message: "An error occurred",
            },
          ],
        },
        mockOptions
      );
    }

    function mockInvalidSessionResponse() {
      let mockOptions = {
        name: invalidSessionResponse,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Authorization: Bearer authorizedToken",
        },
        method: "GET",
      };

      fetchMock.mock(
        validRequestURL,
        {
          status: 401,
          headers: {
            "Content-type": "application/json",
          },
          body: [
            {
              message: "Expired token",
              error: "expired token",
              error_description: "bad oauth",
            },
          ],
        },
        mockOptions
      );
    }

    function getPostRequest() {
      return {
        Name: "My Account",
        ShippingCity: "Springfield",
      };
    }

    function getPostResponse() {
      return {
        id: "some id",
        success: true,
      };
    }

    function getGetResponse() {
      return {
        totalSize: 1,
        done: true,
        records: [{ id: "someid", Name: "some name" }],
      };
    }

    function mockValidRequest(
      name: string,
      url: string,
      method: string = "GET",
      response: any
    ) {
      let mockOptions = {
        name: name,
        headers: {
          "Content-Type": "application/json",
        },
        method: method,
      };
      fetchMock.mock(url, response, mockOptions);
    }

    it("attaches authorization header to request", () => {
      mockValidRequestWithHeaders();

      let requestURL = validRequestURL;
      let requestOptions = {
        headers: {
          "Content-Type": "application/json",
          "Some-Other-Header": "cool!",
        },
        method: "PATCH",
      };

      return fetcher
        .fetchJSON(requestURL, requestOptions)
        .then(parsedResonse => {
          expect(parsedResonse.allGood).toBeTruthy();
          expect(fetchMock.called(validRequestWithHeaders)).toBeTruthy();
        });
    });

    it("handles response errors", () => {
      mockErrorResponse();

      let requestURL = validRequestURL;
      let requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      };

      return fetcher.fetchJSON(requestURL, requestOptions).catch((err: any) => {
        expect(err.message).toBe("An error occurred");
      });
    });

    it("attempts to refresh token on invalid session and retries request", () => {
      mockValidRequest("get", validRequestURL, "GET", {
        status: 200,
        body: getGetResponse(),
      });
      mockInvalidSessionResponse();

      let requestURL = validRequestURL;
      let requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      };

      return fetcher.fetchJSON(requestURL, requestOptions).then((res: any) => {
        expect(res.totalSize).toBe(1);
        expect(res.done).toBe(true);
        expect(res.records).toHaveLength(1);
      });
    });
  });

  describe("revokeAccessToken", () => {
    let validRevokeURL =
      "https://instanceURL/requiredtest/services/oauth2/revoke";
    let validRevokeRequest = "validRevokeRequest";
    let validRevokeBody = "token=authorizedToken";
    let validRevokeOptions = {
      name: validRevokeRequest,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    };
    let lastEmittedStatus: string;
    describe("with valid response", () => {
      function validateExpectedBody(url, options): any {
        if (options.body === validRevokeBody) {
          return Promise.delay(300).then(() => {
            return {
              status: 200,
            };
          });
        } else {
          return {
            throws: `{ options.body } did not equal expect: { options.body }`,
          };
        }
      }

      beforeEach(() => {
        fetcher = Fetcher.Create(options);
        fetcher.options.accessToken = "authorizedToken";
        fetchMock.mock(
          validRevokeURL,
          validateExpectedBody,
          validRevokeOptions
        );
        lastEmittedStatus = null;
        fetcher.on("accessTokenRevoking", () => {
          lastEmittedStatus = "accessTokenRevoking";
        });
        fetcher.on("accessTokenRevoked", () => {
          lastEmittedStatus = "accessTokenRevoked";
        });
      });

      it("makes valid request", () => {
        return fetcher.revokeAccessToken().then(() => {
          expect(fetchMock.calls().matched.length).toBe(1);
          expect(fetchMock.called(validRevokeRequest)).toBeTruthy();
        });
      });

      it("emits events", () => {
        expect(lastEmittedStatus).toBeNull();
        fetcher.revokeAccessToken().then(() => {
          expect(lastEmittedStatus).toEqual("accessTokenRevoked");
        });
        expect(lastEmittedStatus).toEqual("accessTokenRevoking");
      });
    });

    describe("with missing accessToken", () => {
      it("throws error", () => {
        fetcher.options.accessToken = null;
        expect(() => fetcher.revokeAccessToken()).toThrowError(
          "No Access Token to Revoke"
        );
      });
    });

    describe("with non-200 response", () => {
      beforeEach(() => {
        fetcher = Fetcher.Create(options);
        fetcher.options.accessToken = "authorizedToken";
        fetchMock.mock(validRevokeURL, { status: 404 }, "404request");
      });

      it("throws error", () => {
        return fetcher
          .revokeAccessToken()
          .then(() => {
            throw "expected to throw an error";
          })
          .catch(caughtError => {
            expect(caughtError.requestURL).toEqual(validRevokeURL);
            expect(caughtError.requestOptions.body).toEqual(validRevokeBody);
            expect(caughtError.response.status).toBe(404);
          });
      });
    });
  });
});
