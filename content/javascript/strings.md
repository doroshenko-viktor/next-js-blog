---
title: JS - Strings
date: "2022-03-12"
description: "Working with Javascript strings"
---

## String Object Vs String Primitive

There is a difference between value and reference strings in `js`.

String primitives:

```js
const s1 = "s1";
const s2 = 's2';
const s3 = String("s3");
console.log(typeof s1) // "string"
```

String objects:

```js
const s1 = new String("s1");
console.log(typeof s1)  // "object"
```

## String Methods

**split:**

To split given string by specified character use `String.split(<divisior>, <limit>)` method on this 
string, where `divisior` should also be some string pattern on which original string will be divided:

```js
const str = "val1;;val2;;val3";
const parts = str1.split(";;");
// parts: ['val1', 'val2', 'val3']
```

**join:**

`join` is an array method, but it returns a string of all elements of this array, combined into a
single string with specified divisior:

```js
const parts = ["first", "second", "third"];
const str = parts.join("; ");
// str: "first; second; third"
```

If divisior is not specified, default divisior will be `,`.

**Accessing individual characters:**

To get character from string with given index use `charAt` method:

```js
const str = "abcde";
const charB = str.charAt(1);
// or
const charB_Ecma5 = str[1];
```

**Multiline strings:**

To create long strings on multiple lines it is possible to add multiple strings with `+`, but the
following will have same result:

```js
const str = "line1 \
  line2 \
  line3";
```
