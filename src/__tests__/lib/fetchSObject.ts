import * as sinon from "sinon";

import { Fetcher } from "../../lib/fetcher";
import { FetchSObject } from "../../lib/fetchSObject";
import { SalesforceOptions } from "../../lib/salesforceOptions";
import { withValidSalesforceOptions } from "./salesforceOptions";

describe("fetchSObject", () => {
  let fetcher: Fetcher;
  let options: SalesforceOptions;
  let fetchSObject: FetchSObject;
  let fetchJSONStub: sinon.SinonStub;

  beforeEach(() => {
    options = withValidSalesforceOptions();
    fetcher = Fetcher.Create(options);
    fetchSObject = FetchSObject.Create(fetcher, options);

    fetchJSONStub = sinon
      .stub(fetcher, "fetchJSON")
      .returns(Promise.resolve("success"));
  });

  afterEach(() => {
    fetchJSONStub.restore();
  });

  describe("constructor", () => {
    it("sets fetcher and options", () => {
      expect(fetchSObject.fetcher).toBe(fetcher);
      expect(fetchSObject.options).toBe(options);
    });
  });

  describe("insert", () => {
    it("calls fetchJSON", testDone => {
      let sObjectName = "Account";
      let sObjectBody = {
        Name: "test name",
      };

      let expectedURL =
        "https://instanceURL/test/services/data/v37.0/sobjects/Account";
      let expectedOptions = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: '{"Name":"test name"}',
      };

      fetchSObject.insert(sObjectName, sObjectBody).then(result => {
        expect(result).toBe("success");
        expect(
          fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)
        ).toBeTruthy();
        testDone();
      });
    });
  });

  describe("get", () => {
    let sObjectName: string;
    let id: string;

    beforeEach(() => {
      sObjectName = "Case";
      id = "a0Ga000000awuHe";
    });

    it("calls fetchJSON", () => {
      let expectedURL =
        "https://instanceURL/test/services/data/v37.0/sobjects/Case/a0Ga000000awuHe";
      let expectedOptions = {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      };

      return fetchSObject.get(sObjectName, id).then(result => {
        expect(result).toBe("success");
        expect(fetchJSONStub.calledOnce).toBeTruthy();
        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
      });
    });
  });

  describe("update", () => {
    let sObjectName: string;
    let sObjectBody: any;
    let id: string;

    beforeEach(() => {
      sObjectName = "Case";
      sObjectBody = {
        Name: "test case name",
        Subject: "what",
      };
    });

    describe("with id", () => {
      it("calls fetchJSON", () => {
        let expectedURL =
          "https://instanceURL/test/services/data/v37.0/sobjects/Case/a0Ga000000awuHe";
        let expectedOptions = {
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
          body: '{"Name":"test case name","Subject":"what"}',
        };

        return fetchSObject
          .update(sObjectName, "a0Ga000000awuHe", sObjectBody)
          .then(result => {
            expect(result).toBe("success");
            expect(fetchJSONStub.calledOnce).toBeTruthy();
            expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
            expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
          });
      });
    });

    describe("without id", () => {
      it("calls fetchJSON and an exception is thrown", () => {
        let expectedURL =
          "https://instanceURL/test/services/data/v37.0/sobjects/Case/a0Ga000000awuHe";
        let expectedOptions = {
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
          body:
            '{"Name":"test case name","Subject":"what","id":"a0Ga000000awuHe"}',
        };
        fetchSObject
          .update(sObjectName, null, sObjectBody)
          .catch((err: any) => {
            expect(err.message).toEqual("Invalid body for update, missing id");
          });
      });
    });
  });

  describe("upsert", () => {
    let sObjectName: string;
    let sObjectBody: any;
    let id: string;

    beforeEach(() => {
      sObjectName = "Case";
      sObjectBody = {
        Name: "test case name",
        Subject: "what",
      };
    });

    it("calls fetchJSON", () => {
      let expectedURL =
        "https://instanceURL/test/services/data/v37.0/sobjects/Case/myfield/123";
      let expectedOptions = {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: '{"Name":"test case name","Subject":"what"}',
      };

      return fetchSObject
        .upsert(sObjectName, "myfield", "123", sObjectBody)
        .then(result => {
          expect(result).toBe("success");
          expect(fetchJSONStub.calledOnce).toBeTruthy();
          expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
          expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
        });
    });
  });

  describe("delete", () => {
    let sObjectName: string = "Case";
    let id: string = "a0Ga000000awuHe";

    it("calls fetchJSON", () => {
      let expectedURL =
        "https://instanceURL/test/services/data/v37.0/sobjects/Case/a0Ga000000awuHe";
      let expectedOptions = {
        method: "DELETE",
      };

      return fetchSObject.delete(sObjectName, id).then(result => {
        expect(result).toBe("success");
        expect(fetchJSONStub.calledOnce).toBeTruthy();
        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
      });
    });
  });
});
