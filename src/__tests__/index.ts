import { FetchSalesforce, SalesforceOptions } from "../index";
import { withRequiredSalesforceOptions } from "./lib/salesforceOptions";

test("exports FetchSalesforce and SalesforceOptions", () => {
  let options: SalesforceOptions = withRequiredSalesforceOptions();
  let fetchSalesforce = new FetchSalesforce(options);
});
