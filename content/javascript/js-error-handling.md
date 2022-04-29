---
title: JavaScript Error Handling
date: "2022-04-13"
description: "JS error handling best practices"
---

When on some part of code execution unexpected situation happens will be created and thrown `Error` object. Then going up by call stack `JavaScript` interpreter will check for `try/catch` logic on each next
level until the end of call stack resulting to termination of the program.

## Error Object

`Error` is a most basic type of exception object in `JavaScript`. Also this object is often used as a custom error objects prototype.

Standard forces exception to have at least two fields:

- `name` - defined type of error
- `message` - human readable description of exception, which should give some error context

On most modern browsers `Error` object contains `stack` field, which contains information about call stack of execution, which may be useful to get a context of exception.

**Built-in `JS` error types:**

- `RangeError` - usually thrown, when out of expected input provided. e.g. following code will throw `RangeError`:

  ```js
  var pi = 3.14159
  pi.toFixed(100000)
  ```

- `ReferenceError` - is thrown on attempt to access non existing variable
- `SyntaxError` - is thrown, when syntactically invalid provided to the `JS` interpreter
- `TypeError` - thrown, when there is an attempt to use a type in a not appropriate way. e.g. trying to execute non-existing method
- `URIError` - thrown by `encodeURI` or `decodeURI`, when not valid `url` provided
- `EvalError` - thrown by `eval` function

## Error Handling

There is a special construct to handle errors in `JavaScript`:

```js
try {
  // executing code
} catch (err) {
  // handling possible error
} finally {
  // this will be executed both in success and error cases
}
```

_catch_ block stops propagation of error further up on the call stack and allows to react to the error happened.

When there is a need to differentiate reaction on different kinds of errors it is possible to use `instanceof` operator to distinguish error type:

```js
try {
  // ...
} catch (err) {
  if (err instanceof TypeError) {
    // handling TypeError
  } else if (err instanceof ReferenceError) {
    // handling ReferenceError
  } else {
    // handle any other error type, e.g.
    throw err
  }
}
```

It is possible to re-throw caught error any number of times.

## Async Error Handling

When dealing with asynchronous code `try/catch` clause may not catch possible exceptions. This may happen because asynchronous function running outside of call stack, calling it.

```js
try {
  throwingAsyncFunc() // this function throws exception asynchronously
} catch (err) {
  // exception will not be caught here
}
```

If `throwingAsyncFunc` returns `Promise` it is possible to use `async/await` pattern to handle it's errors with `try/catch` block:

```js
async function handler() {
  try {
    await throwingAsyncFunc() // this function throws exception asynchronously
  } catch (err) {
    // exception will be caught here
  }
}
```

## Error Event

In `JavaScript` errors are also events. So it is possible to react on this events. For example in browser api it is possible to do with following event listener:

```js
window.addEventListener("error", function (e) {
  console.log(e.error)
})
```

Such error handler will catch unhandled errors from any execution context.
Moreover, `addEventListener` allows to attach to the `error` event variety of different handlers.
This allows to create many centralized handlers for different error types.

For `Node.Js`:

```js
process.on("uncaughtException", error => {
  // handle error
})
```

It is also useful to use error events and not directly throw an error when dealing with streams.

```js
source.run(stream => {
  stream
    .on("data", data => {
      // handle arriving piece of data
    })
    .on("end", result => {
      // handling end of stream
    })
    .on("error", err => {
      // handling possible error during the stream
    })
})
```

## Custom Errors

If there is a need to catch and re-throw some custom exception up it is a good practice to maintain a context of previous exception:

```js
class CustomError extends Error {
  constructor(message, err) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }
    this.wrappedError = err
    this.name = "CustomError"
    this.date = new Date()
  }
}
```

## References

- [Better errors handling for ES/Typescript classes](https://blog.bitsrc.io/errors-handling-for-vue-class-components-2f152f7c7515)
- [A Guide to Proper Error Handling in JavaScript](https://www.sitepoint.com/proper-error-handling-javascript/)
- [Node.js Error Handling Made Easy: Best Practices On Just About Everything You Need to Know](https://sematext.com/blog/node-js-error-handling/#toc-types-of-errors-operational-vs-programmer-errors-2)
- [MDN Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
