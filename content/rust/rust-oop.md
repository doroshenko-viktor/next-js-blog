---
title: Rust - OOP Features
date: "2022-03-02"
description: "Writing Rust code in Object Oriented way"
---

## Traits

It is allowed for different traits to have method definitions with same signatures and also these
traits may be implements on the same struct. Moreover, this struct can implement method with same
signature on it's `impl` block.

```rust
trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}

impl Human {
    fn fly(&self) {
        println!("*waving arms furiously*");
    }
}
```

When we try to create `Human` and run `fly` method, own `Human`'s implementation will be called:

```rust
fn main() {
    let person = Human;
    person.fly();
}
// will print: "*waving arms furiously*"
```

If we need to run implementation of `fly` from specific trait, we need to call it explicitly:

```rust
fn main() {
    let person = Human;
    Pilot::fly(&person);
    Wizard::fly(&person);
    person.fly();
}
```

## Supertraits

`Supertraits` allow to inherit functionality from another traits. For example:

```rust
use std::fmt;

trait OutlinePrint: fmt::Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("*{}*", " ".repeat(len + 2));
        println!("* {} *", output);
        println!("*{}*", " ".repeat(len + 2));
        println!("{}", "*".repeat(len + 4));
    }
}
```

`OutlinePrint` extends functionality of `fmt::Display` trait so it is possible to use `self.to_string`
inside of it's methods.

But we still need to implement `fmt::Display` to make it work:

```rust
struct Point {
    x: i32,
    y: i32,
}

impl OutlinePrint for Point {}

use std::fmt;

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}
```

## References

- [Advanced Traits](https://doc.rust-lang.org/stable/book/ch19-03-advanced-traits.html)
