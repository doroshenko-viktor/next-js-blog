---
title: Node.Js Http
date: "2022-04-26"
description: "Basics of Node.Js http serving and working with networking third party modules"
---

Node.Js has rich `http` protocol support built in. Functions, related to serving `http` are gathered in `node:http` module.

To import it using `common-js`:

```js
const http = require('node:http');
```

Or `es6` imports:

```js
import http from 'node:http';
```

## Http Server

`http` module contains default implementation of an http server. To create simple version of it use `http.createServer`:

```ts
const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    console.info(`serving request: ${req.method}: ${req.url}`);

    res.write("RESPONSE", (err) => {
      if (err) {
        console.error(err);
      }
    });

    res.end();
  }
);

server.listen(8000, () => { console.log("listening on port 8000"); });
```

This code creates http server, which will listen for requests on port `8000`.

Here `createServer` has signature:

```ts
function createServer(requestListener?: RequestListener): Server;
type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
```

To parse url there is `node:url` module:

```ts
const reqUrl: UrlWithParsedQuery = url.parse(req.url, true);
console.info(reqUrl.pathname);
for (const val in reqUrl.query) {
    console.info(`${val} => ${reqUrl.query[val]}`);
}
```

where `UrlWithParsedQuery`:

```ts
interface Url {
    auth: string | null;
    hash: string | null;
    host: string | null;
    hostname: string | null;
    href: string;
    path: string | null;
    pathname: string | null;
    protocol: string | null;
    search: string | null;
    slashes: boolean | null;
    port: string | null;
    query: string | null | ParsedUrlQuery;
}
interface UrlWithParsedQuery extends Url {
    query: ParsedUrlQuery;
}
```

**Simple html server example:**

Let's create a simple implementation of an `html` server, which will serve `html` file depending on url path.

```ts
import http, { IncomingMessage, ServerResponse } from "node:http";
import url, { UrlWithParsedQuery } from "node:url";
import fs from "node:fs";
import path from "node:path";

// this function constructs path in local file system 
// to locate particular html file by url path
const getServedFileName = (requestPath: string) => {
  if (requestPath === "/") {
    return path.join("..", "public", "index.html");
  }
  return path.join("..", "public", `${requestPath}.html`);
};

// creating http server
const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url) {
      return res.writeHead(400, "Bad request");
      return res.end();
    }

    const requestUrl: UrlWithParsedQuery = url.parse(req.url, true);
    const requestPath = requestUrl.pathname;
    console.info("serving: " + requestPath);

    if (!requestPath) {
      res.writeHead(400, "Bad request");
      return res.end();
    }

    // generate path to correct html page file
    const fileName = getServedFileName(requestPath);

    // reading file from local file system
    fs.readFile(fileName, (err, data) => {
      if (err) {
        res.writeHead(500, "Server error");
        console.error(err);
        return res.end();
      }

      res.writeHead(200, "OK");
      res.write(data, (err) => {
        if (err) {
          console.error(`Error serving request ${err}`);
        }
      });
      return res.end();
    });
  }
);

// starting the server
server.listen(8000, () => {
  console.log("listening on port 8000");
});
```

This implementation assumes, that `html` files are placed in a folder named `public`, which located
one level up from our running server.

## HTTP Requests

Node.Js `http` module has an ability to perform `HTTP` requests. To do this, use `http.request` function.

For example:

```ts
function makeRawHttpRequest<T>(
  host: string,
  urlPath: string
): Promise<T> {
  const options = {
    hostname: host,
    path: urlPath,
    method: "GET",
  };

  return new Promise<T>((resolve, reject) => {
    http
      .request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const result = JSON.parse(data) as T;
          console.log("Body:", result);
          resolve(result);
        });
      })
      .on("error", (err) => {
        console.log("Error: ", err);
        reject(err);
      })
      .end();
  });
}
```

But this requires some boilerplate code to manually handle stream events and parse data.
There are many third party libraries, like `axios`, which simplify this process.

## Plan

- http2
- https
- axios