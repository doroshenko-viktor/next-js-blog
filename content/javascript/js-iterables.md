---
title: JS - Iterables And Collections
date: "2022-03-12"
description: "Working with Javascript iterables and collections"
---

## Iterables

In `JS` iterables are objects, which implement `iterable` protocol and have `@@iterator` method.
Those are arrays, linked lists, maps, sets, strings and so on.

There are also `array-like objects` - objects, that have a length and possibility to acces it's
elements by index.

## Array

To create an array in `JS` there are many possible ways:

```js
const a1 = ['elem'];
const a2 = Array('elem');
const a3 = new Array('elem');
const a4 = Array.of('elem');
const a5 = Array.from('elem');
```

*Note: `new Array(5)` or `Array(5)` will create new empty array with given length of 5*

`Array.from(iterable)` - this method is meant to convert an array-like object or iterable to an
actual array.

e.g.

```js
const arr = Array.from('string');
// will contain ['s', 't','r', 'i', 'n', 'g'];
```

### Looping Over Array

To loop over an iterable object we can use `for .. of ..` loop:

```js
for (const data of iterable) {}
```

### Array Methods

**push:**

To add an element to the end of the collection use `push` method:

```js
const elems = [1, 2, 3];
elems.push(4);
// will contain [1,2,3,4]
```

**unshift:**

To add an element to the beginning of the collection use `unshift` method:

```js
const elems = [1, 2, 3];
elems.unshift(0);
console.log(elems);
// will contain [0,1,2,3]
```

**pop:**

`pop` method removes last element of a collection and returns it:

```js
const lastElem = elems.pop();
```

**shift:**

Method `shift` removes one element from the beginning of a collection:

```js
const firstElem = elems.shift();
```

**splice:**

Method `splice` allows to remove arbitrary number of elements in the given array and replace them
with any number of new elements. It is an array method an can't be called on other iterables.

`arr.splice(<start position>, <amount of removed elements>, ...<collection of elements to insert>)`

```js
const elems = [1, 2, 3];
elems.splice(1, 2, ...[5, 6]);
// result elems => [1, 5, 6]
```

It is also possible to remove elements counting from the tail. To do this use less than 0 index:

```js
elems.splice(-2, 1, 7);
// result elems => [1, 7, 6]
```

**slice:**

`slice` method allows to create a copy of some part of the array:

```js
const elems1 = [1, 2, 3, 4, 5];
const elemsCopy = elems1.slice(2, 4);
// elemsCopy: [3, 4]
```

It is also possible to use negative indexes to count from the tail of the collection.

Not specifying range will copy the entire array: 

```js
const elems1 = [1, 2, 3, 4, 5];
const fullCopy = elems1.slice();
```

**concat:**

`concat` method accepts another collection and return as a result new array, where current and
given array are concatenated together. It does not change original array.

**indexOf:**

`indexOf` allows to find index of specified element in the collection. Second argument allows to
define starting position to search. If specified, any previous hits will not be counted.
If nothing found result will be `-1`.

```js
const elemsToSearch = [1, 2, 1, 1, 1, 2, 1];
const i = elemsToSearch.indexOf(2, 3);
// `i` will be 5
```

**includes:**

Allows to check wheather given element exists in collection:

```js
const elems = [1, 2, 3, 4];
const exists3 = elems.includes(3);
// true
```

*Important to notice, that it will work with value types, because equality of reference types
words differently*

**lastIndexOf:**

`lastIndexOf` has the same functionality as `indexOf`. The only difference - it searches starting
from the end of the collection towards it's beginning.

**find:**

`find` allows to search for required element in the specified array by given predicate:

```js
const complElemsToSearch = [{ key: 1 }, { key: 2 }, { key: 3 }];
const foundElem = complElemsToSearch
  .find((val, ind, arr) => val.key === 2);
```

Where `val` is a reference to the current iteration value, `ind` - index of current iteration and
`arr` is a reference to the whole array.

It returns reference to the found object, but no it's index.
To search for index use `findIndex` method with the same signature.

**forEach:**

This method allows to iterate over every item in the array and perform some action, specified with
provided function.

```js
const elements = [1, 2, 3, 4, 5];
elements.forEach((val, ind, arr) => {
  console.log(`current value is ${val}`);
})
```

**map:**

If there is a need to perform some action on every element of a collection and store results in a
new collection, it can't acheived with `map` method:

```js
const elements = [1, 2, 3, 4, 5];
const resultElements = elements
  .map((val, ind, arr) => val * 2);
// resultElements: [2, 4, 6, 8, 10]
```

**filter:**

To filter some collection with given predicate and return result as a new array, use `filter`:

```js
const elemsToFilter = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const filtered = elemsToFilter
  .filter((val, ind, arr) => val % 2 === 0);
// filtered: [2, 4, 6, 8]
```

**reduce:**

When you need to calculate some single value from whole collection values(reduce) it is a usecase
for `reduce` method. For example, when we need to calculate sum of all array numbers:

```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const sum = numbers
  .reduce((prev, curr, ind, arra) => prev + curr, 0);
// sum: 45
```

It accepts a reducer function, which signature contains accumulation value and current value, as 
well as usual for some other collection methods index and whole array reference. And also `reduce`
accepts second optional value - initial accumulation value.

### Sorting

**sort:**

```js
const elemsToSort = [1, 5, 2, 3, 10, 4, 6];
const sorted = elemsToSort.sort((a, b) => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
});
// sorted: [1, 2, 3, 4, 5, 6, 10]
```

## Set

`Set` is a data structure, which contains unordered and arbitrary number of unique elements. It is
iterable, but also contains some unique methods. It does not guarantee order of stored elements and
does not allow access to elements by index.

Creting `Set`:

```js
const s1 = new Set([1, 2, 3]);
console.log(s1);
```

Iterating over `Set`;

```js
for (const elem of s1.entries()) {
  console.log(elem);
}
```

Cheching existence and deleting of element inside `Set`:

```js
if (s1.has(2)) {
  s1.delete(2);
}
```

## Map

`Map` is a `key-value` data structure, where key must be a unique value. It is iterable with some
additional methods. It does not allow acces by index. Instead values may be accessed only by it's
keys. Unlike `object` keys may be not only of `string`, `number` or `symbol` type, but any type.

Maps are quite similar to js objects, but unlike them maps allow any data as key and also may be
more performant on large amount of data sets. Also maps are better on frequent inserts/removes of
data.

Creating of `Map`:

```js
const m1 = new Map([
  ["key1", "value1"],
  ["key2", "value2"],
]);
```

Inserting and retrieving values:

```js
m1.set("key3", "value3");
const value2 = m1.get("key2");
```

Iterating over `Map`:

```js
for (const [key, value] of m1.entries()) {
  console.log(key, value);
}
```

`entries()` returns key/value pairs iterable of two elements arrays. 
But maps have also `keys()` methods, which returns iterable of only map's keys and
`values()` method, which returns all values from map.

To get size of map:

```js
const m1length = m1.size;
```
