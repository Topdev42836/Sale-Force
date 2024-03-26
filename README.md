# fetch-salesforce

> `fetch-salesforce` is a wrapper for the Salesforce.com REST API using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This library was initially developed to be used in React Native projects that needed to access the Salesforce API, but it can be used in any environment that supports `fetch`.

[![Build Status](https://travis-ci.org/kidtsunami/fetch-salesforce.svg?branch=master)](https://travis-ci.org/kidtsunami/fetch-salesforce)
[![Coverage Status](https://coveralls.io/repos/github/kidtsunami/fetch-salesforce/badge.svg?branch=master)](https://coveralls.io/github/kidtsunami/fetch-salesforce?branch=master)

## Install

```
yarn add fetch-salesforce
```

## Usage

### Setup

```ts
import { SalesforceOptions, FetchSalesforce } from "fetch-salesforce";
const options: any = {
  clientID: "",
  authorizationServiceURL: "",
  tokenServiceURL: "",
  redirectUri: "",
  apiVersion: 39.0,
  logLevel: "DEBUG",
};

const fetchSalesforce = new FetchSalesforce(options);
```

### Insert

```ts
fetchSalesforce.fetchSObject
  .insert("Account", {
    Name: "My Account",
  })
  .then(res => {
    console.log(res);
  });
```

### Query

```ts
fetchSalesforce.fetchQuery
  .query("SELECT ID FROM Account LIMIT 10")
  .then(res => {
    console.log(res);
  });
```

... you get the idea!

### My target doesn't support `fetch`

Use a library like [`cross-fetch`](https://github.com/lquixada/cross-fetch) to polyfill/[ponyfill](https://github.com/sindresorhus/ponyfill) it:

```sh
$ yarn add cross-fetch
```

As a [ponyfill](https://github.com/sindresorhus/ponyfill):

```ts
import fetch from "cross-fetch";
```

As a polyfill:

```ts
import "cross-fetch/polyfill";
```

## Developing `fetch-salesforce`

### Install

```
git clone https://github.com/kidtsunami/fetch-salesforce
cd fetch-salesforce
```

### Compiling

```
tsc
```

### Running Tests

```
yarn test
```
