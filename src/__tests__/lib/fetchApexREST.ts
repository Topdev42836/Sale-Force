import * as sinon from "sinon";

import { FetchApexREST } from "../../lib/fetchApexREST";
import { Fetcher } from "../../lib/fetcher";
import { SalesforceOptions } from "../../lib/salesforceOptions";
import { withRequiredSalesforceOptions } from "./salesforceOptions";

describe("fetchApexREST", () => {
  let fetcher: Fetcher;
  let options: SalesforceOptions;
  let fetchApexREST: FetchApexREST;
  let fetchJSONStub: sinon.SinonStub;

  beforeEach(() => {
    options = withRequiredSalesforceOptions();
    fetcher = Fetcher.Create(options);
    fetchApexREST = FetchApexREST.Create(fetcher, options);

    fetchJSONStub = sinon
      .stub(fetcher, "fetchJSON")
      .returns(Promise.resolve("success"));
  });

  afterEach(() => {
    fetchJSONStub.restore();
  });

  describe("constructor", () => {
    it("sets fetcher and options", () => {
      expect(fetchApexREST.fetcher).toBe(fetcher);
      expect(fetchApexREST.options).toBe(options);
    });
  });

  describe("get", () => {
    it("calls fetchJSON", testDone => {
      let endpointPath = "endpoint/path";
      let expectedURL =
        "https://instanceURL/requiredtest/services/apexrest/endpoint/path";
      let expectedOptions = { method: "GET" };

      fetchApexREST.get(endpointPath).then(result => {
        expect(result).toBe("success");

        expect(
          fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)
        ).toBeTruthy();
        testDone();
      });
    });
  });

  describe("post", () => {
    it("calls fetchJSON", () => {
      let endpointPath = "endpoint/postpath";
      let body = { aNumber: 5, aString: "teststring" };

      let expectedURL =
        "https://instanceURL/requiredtest/services/apexrest/endpoint/postpath";
      let expectedOptions = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: '{"aNumber":5,"aString":"teststring"}',
      };

      return fetchApexREST.post(endpointPath, body).then(result => {
        expect(result).toBe("success");

        expect(fetchJSONStub.calledOnce).toBeTruthy();
        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
      });
    });
  });

  describe("patch", () => {
    it("calls fetchJSON", () => {
      let endpointPath = "endpoint/patchpath";
      let body = { aNumber: 5, aString: "teststring" };

      let expectedURL =
        "https://instanceURL/requiredtest/services/apexrest/endpoint/patchpath";
      let expectedOptions = {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: '{"aNumber":5,"aString":"teststring"}',
      };

      return fetchApexREST.patch(endpointPath, body).then(result => {
        expect(result).toBe("success");

        expect(fetchJSONStub.calledOnce).toBeTruthy();
        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
      });
    });
  });

  describe("delete", () => {
    it("calls fetchJSON", () => {
      let endpointPath = "endpoint/deletepath";

      let expectedURL =
        "https://instanceURL/requiredtest/services/apexrest/endpoint/deletepath";
      let expectedOptions = { method: "DELETE" };

      return fetchApexREST.delete(endpointPath).then(result => {
        expect(result).toBe("success");

        expect(
          fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)
        ).toBeTruthy();
      });
    });
  });
});
