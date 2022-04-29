---
title: Rust - Functions
date: "2022-03-15"
description: "Working with functions in Rust"
---

## Delegating Functions With Function Pointers

Function pointers allow to pass regular function into other functions as a parameters.
The `fn` type is called a function pointer.

```rust
fn add_one(x: i32) -> i32 {
    x + 1
}

fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
    f(arg) + f(arg)
}

fn main() {
    let answer = do_twice(add_one, 5);

    println!("The answer is: {}", answer);
}
```

Unlike closures, `fn` is a type rather than a trait, so we specify `fn` as the parameter type 
directly rather than declaring a generic type parameter with one of the `Fn` traits as a trait bound.

Function pointers implement all three of the closure traits `Fn`, `FnMut`, and `FnOnce`, so you 
can always pass a function pointer as an argument for a function that expects a closure. It’s 
best to write functions using a generic type and one of the closure traits so your functions can 
accept either functions or closures.

## Closures

To return closure from a function it must be wrappet into some smart pointer, because it does not
clear in the compile time, how much space a closure will take.

```rust
fn returns_closure() -> Box<dyn Fn(i32) -> i32> {
    Box::new(|x| x + 1)
}
```


