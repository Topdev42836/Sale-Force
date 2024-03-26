import {
  formatApiVersion,
  SalesforceOptions,
  withDefaults,
} from "../../lib/salesforceOptions";

export function withValidSalesforceOptions(): SalesforceOptions {
  let testOptions: SalesforceOptions = {
    instanceURL: "https://instanceURL/test/",
    clientID: "testclientid",
    clientSecret: "testclientsecret",
    refreshToken: "arefreshtoken",
    apiVersion: 37,
    sfdcCommunityID: "avalidcommunityid",
    authorizationServiceURL: "https://instanceURL2/test/authorize",
    authorizationResponseType: "code",
    tokenServiceURL: "https://instanceURL3/test/token",
    revokeServiceURL: "https://instanceURL4/test/revoke",
    redirectUri: "https://instanceURL2/test/redirrrrect",
  };

  return testOptions;
}
export function withRequiredSalesforceOptions(): SalesforceOptions {
  let testOptions: SalesforceOptions = {
    instanceURL: "https://instanceURL/requiredtest/",
    clientID: "testclientid",
    refreshToken: "arefreshtoken",
  };

  return testOptions;
}

describe("withDefaults", () => {
  let testOptions: SalesforceOptions;
  describe("withValidOptions", () => {
    beforeEach(() => {
      testOptions = withValidSalesforceOptions();
    });

    it("does not override existing api version", () => {
      let options = withDefaults(testOptions);

      expect(options.apiVersion).toEqual(37);
    });

    it("does not override existing authorizationResponseType", () => {
      let options = withDefaults(testOptions);

      expect(options.authorizationResponseType).toEqual("code");
    });
  });

  describe("withRequiredOptions", () => {
    beforeEach(() => {
      testOptions = withRequiredSalesforceOptions();
      expect(testOptions.apiVersion).toBeUndefined();
    });

    it("sets default api version", () => {
      expect(testOptions.apiVersion).toBeUndefined();
      let options = withDefaults(testOptions);

      expect(options.apiVersion).toEqual(38);
    });

    it("sets default authorizationResponseType", () => {
      let options = withDefaults(testOptions);

      expect(options.authorizationResponseType).toEqual("token");
    });
  });
});

describe("formatApiVersion", () => {
  it("formats 38 as v38.0", () => {
    let formattedApiVersion = formatApiVersion(38);

    expect(formattedApiVersion).toEqual("v38.0");
  });
});
