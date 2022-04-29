---
title: JavaScript Object
date: "2022-03-22"
description: "Working with JS Object"
---

`Object` is a basic structure in `js`. Almost all data structures, except some primitives like
`number`, `string`, `boolean`, `bigint`, `undefined`, `symbol` and `null` are inherited from `object`.
This also means that these inherited objects also have all properties from `Object.prototype`.

To remove some keys from `object` there is a special operator `delete` for it.

## Object Methods

- **assign:** allows to copy source object properties into target object. This is something similar
  to spread operator.

- **create:** creates new object using provided object as it's prototype.

- **entires:** allows to get all provided object's key/value pairs in from of array

## This

`this` keyword allows to refer to object properties, related to context of execution.

```js
const obj = {
  key1: "value1",
  printValue() {
    console.log(`key1: ${this.key1}`)
  },
}

obj.printValue() // key1: value1
```

But it is important to understand that `this` in JavaScript is not always stick to object, where function, calling it is defined,
but it depends on context, where this function has been executed:

```js
const obj = {
  key1: "value1",
  printValue() {
    console.log(`key1: ${this.key1}`)
  },
}

let { printValue } = obj
printValue() // `key1: undefined`
```

Here `printValue` has been called in the not in context of `obj` where it is defined, but in context of `window` object, which means that here `this` is `window`.

**bind:**

But it is possible to glue a function with it's context with `bind` method, which accepts as a first parameter object, which will be used as `this` on the next call
of the function. Rest parameters of `bind` are function parameters. Result of bind is a function, which, when executed in future, will use specified `this` object:

```js
const obj = {
  key1: "value1",
  printValue() {
    console.log(this)
    console.log(`key1: ${this.key1}`)
  },
}

let { printValue } = obj
printValue = printValue.bind(obj)
printValue() // key1: value1
```

**call:**

`call` method has similar signature and purpose as `bind`, the difference, that `call` immediately executes a function on which it has been executed with specified
object as `this`.

```js
func1.call(thisObj, param1, param2, ...);
```

**apply:**

`apply` method also allows to specify `this` and immediately call the function, but has different signature. It allows to pass parameters to executed function as an
array unlike `call`, which receives parameters as separated arguments.

```js
func1.apply(thisObj, [param1, param2, ...]);
```

### This With Different Function Definitions

Regular function definition and function declaration takes it's `this` object from context of execution as described above. But arrow functions, declared with `() => {}`
syntax don't know about `this`. Such a functions will take it from external context. This means, that `this` inside of arrow function will be the object, from nearest
external level, where `this` is defined. For example:

```js
const obj = {
  key1: "value1",
  methodFunction() {
    console.log(`key1 from methodFunction: ${this.key1}`)
    const internalArrowFunc = () => {
      console.log(`key1 from internalArrowFunc: ${this.key1}`)
    }
    internalArrowFunc()
  },
  arrowFunc: () => {
    console.log(`key1 from arrowFunc: ${this.key1}`)
  },
}

obj.methodFunction()
obj.arrowFunc()
```

This example will give the result:

```text
key1 from methodFunction: value1
key1 from internalArrowFunc: value1
key1 from arrowFunc: undefined
```



## Iterating Over Object

With `for ... in` loop is possible to iterate over all object keys:

```js
const obj = {
  key1: "value1",
  key2: "value2",
  key3: "value3",
}

for (const key in obj) {
  console.log(`key: ${key} => ${obj[key]}`)
}
```

## Plan

- object destructuring
- spread operator and Object.assign

## References

- [MDN Primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
