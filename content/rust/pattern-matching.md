---
title: Rust - Pattern Matching
date: "2022-03-11"
description: "Pattern matching in Rust"
---

Pattern matching in Rust implemented with `match` statement, which contains list of pattern to 
expression pairs called `arms`. 

```rust
match VALUE {
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
}
```

`match` arms must contain all possible variants of execution. There will be a compilation error
if there is some case of exectution which not specified as a `match` arm.

One solution to use `_` pattern, which allows to gather all possible variants, not specified
directly.

## if let

Another solution for situations when we need to catch only one pattern case is to use `if let` construct.

```rust
fn main() {
    let favorite_color: Option<&str> = None;
    let is_tuesday = false;
    let age: Result<u8, _> = "34".parse();

    if let Some(color) = favorite_color {
        println!("Using your favorite color, {}, as the background", color);
    } else if is_tuesday {
        println!("Tuesday is green day!");
    } else if let Ok(age) = age {
        if age > 30 {
            println!("Using purple as the background color");
        } else {
            println!("Using orange as the background color");
        }
    } else {
        println!("Using blue as the background color");
    }
}
```

Here important to notice, that `let if` as well as `match` can create shadowing varable, like in
line `} else if let Ok(age) = age {`. This means that further `if age > 30` has the value from `Ok(age)`
and not original `age`. And also this means that it is not possible to use age this way:
`} else if let Ok(age) = age && age > 30{`.

## while let

This expression is sililar to `if let`, but here `while` loop will run until pattern is matching.

```rust
let mut stack = Vec::new();

stack.push(1);
stack.push(2);
stack.push(3);

while let Some(top) = stack.pop() {
    println!("{}", top);
}
```

## for

`for` loop in Rust also uses pattern matching. In particular, expression, following `for` keyword
is a pattern.

```rust
let v = vec!['a', 'b', 'c'];

for (index, value) in v.iter().enumerate() {
    println!("{} is at index {}", value, index);
}
```

## let

Assignment in Rust is also a pattern. For example: `let x = 5;` is `let PATTERN = EXPRESSION;`. 
Example, `x` is a pattern that means “bind what matches here to the variable x.” Because the name 
`x` is the whole pattern, this pattern effectively means “bind everything to the variable `x`, 
whatever the value is.”

More complex example of it:

```rust
let (x, y, z) = (1, 2, 3);
```

Functional parameters also may be patterns:

```rust
fn print_coordinates(&(x, y): &(i32, i32)) {
    println!("Current location: ({}, {})", x, y);
}

fn main() {
    let point = (3, 5);
    print_coordinates(&point);
}
```

**Matching literals:**

```rust
let x = 1;

match x {
    1 => println!("one"),
    2 => println!("two"),
    3 => println!("three"),
    _ => println!("anything"),
}
```

**Matching Named Variables:**

```rust
let x = Some(5);
let y = 10;

match x {
    Some(50) => println!("Got 50"),
    Some(y) => println!("Matched, y = {:?}", y),
    _ => println!("Default case, x = {:?}", x),
}

println!("at the end: x = {:?}, y = {:?}", x, y);
```

**Matching Multiple Patterns:**

```rust
let x = 1;

match {
    1 | 2 => println!("one or two"),
    3 => println!("three"),
    _ => println!("anything"),
}
```

**Matching Ranges:**

```rust
let x = 5;

match x {
    1..=5 => println!("one through five"),
    _ => println!("something else"),
}
```

Ranges are only allowed with numeric values or char values, because the compiler checks that the 
range isn’t empty at compile time.

```rust
let x = 'c';

match x {
    'a'..='j' => println!("early ASCII letter"),
    'k'..='z' => println!("late ASCII letter"),
    _ => println!("something else"),
}
```

## Conditional Pattern Matching

`match` also supprts additional conditions:

```rust
let num = Some(4);

match num {
    Some(x) if x < 5 => println!("less than five: {}", x),
    Some(x) => println!("{}", x),
    None => (),
}
```

Extra condition also solves shadowing problem, when `match` creates new variable with same name
which can hide external scope variable:

```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(n) if n == y => println!("Matched, n = {}", n),
        _ => println!("Default case, x = {:?}", x),
    }

    println!("at the end: x = {:?}, y = {}", x, y);
}
```

With `|` operator:

```rust
let x = 4;
let y = false;

match x {
    4 | 5 | 6 if y => println!("yes"),
    _ => println!("no"),
}
```

## @ operator

`@` allows to create new variable and test it on some pattern, but use it after in matched block:

```rust
enum Message {
    Hello { id: i32 },
}

let msg = Message::Hello { id: 5 };

match msg {
    Message::Hello {
        id: id_variable @ 3..=7,
    } => println!("Found an id in range: {}", id_variable),
    Message::Hello { id: 10..=12 } => {
        println!("Found an id in another range")
    }
    Message::Hello { id } => println!("Found some other id: {}", id),
}
```

## References

- [Rust Book - Pattern Matching](https://doc.rust-lang.org/stable/book/ch18-01-all-the-places-for-patterns.html)
