---
title: Rust - Creating Documentation
date: "2022-03-02"
description: "Rust ways to create documented code"
---

Rust has a feature of documentation comments. These comments may be implemented with `///`
directive immediately before piece of documented code. Such comments may be compiled to html docs.
It is possible to use `markdown` markup inside of documentation comments in Rust.

To generate actual documentation use `cargo doc`. It compiles documentation and puts it to the 
`./target/doc` directory inside of the project. 

`cargo doc --open` command not only compiles documentation, but also opens it in the browser.

`//!` declaration used to create documentation for comments. Usually it used for documenting
crates or modules.

## Doc Comments Structure

Example of doc comment:

```rust
/// Prints given value
///
/// # Examples
///
/// ```
/// let val = "value to print";
/// let answer = my_crate::print_value(val);
/// ```
pub fn print_value(val: string) -> () {
    println!("{val}")
}
```

**Sections:**

- `Examples` - list some possible examples, displaying how to use this function. 
  Example code is being run during test. It allows to ensure that doc examples are up to date
  with the code it describes;
- `Panics` - list of cases, when this function may panic;
- `Errors` - list of possible errors;
- `Safety` - If the function is unsafe to call, there should be a section explaining why 
  the function is unsafe and covering the invariants that the function expects callers to uphold.


