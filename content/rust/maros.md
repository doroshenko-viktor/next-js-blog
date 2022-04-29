---
title: Rust - Macros
date: "2022-03-16"
description: "Creation and working with macroses in Rust"
---

`Macros` is a Rust way of `metaprogramming` - writing a code that creates another code.

`println!` and `vec!` are examples of macroses. Internally they execute more code, that has to be
written manually. e.g. with `vec!` it is possible to create an instance of `Vec<T>` and add some
values inside of it during single statement.

Macros are similar to functions, but the bigges difference between them in moment of execution - 
`function` is executed in runtime, whereas `macros` is executed during compile time. That quality
allows for example implement trait for some type inside of a `macros`.

The main con for `macros` is higher complexity to write and read. Also macros have to be defined
strictly before place, where it is used.

**Macros types in Rust:**

- declarative - declared with `macro_rules!`
- procedural:
  - Custom `#[derive]` macros that specify code added with the derive attribute used on structs 
    and enums
  - `Attribute-like` macros that define custom attributes usable on any item
  - `Function-like` macros that look like function calls but operate on the tokens specified as 
    their argument 

## Declarative macros

`Declarative macros` are something similar to `match` expressions, which allows to get values,
compare it with some value and then execute required branch of code and do it on compilation stage.

`declarative macros` are defined with `macro_rules!`.

Consider for example `vec!` macro, which allows to create filled `Vec<T>` instance:

```rust
#[macro_export]
macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
```

`#[macro_export]` allows to import created macro into usage scope. `macro_rules!` is a beginning of
macro definition. After we define the name of the macro and then starts the scope of the macro.
Macro definition has a structure similar to `match` expresstion, where it is possible to define
several arm cases with pattern on the left side and executable code on the right.

Here `( $( $x:expr ),* )` is a pattern. When user enters inside of a macro value data, which will
match this pattern, the code, assosiated with it will be executed.

**Pattern syntax:**

Pattern begins with `(...)`. Inside `$(...)` captures entered value. `$x:expr` defines a name `$x` 
for captured value. `expr` is a Rust expression. `,` indicates, that after captured expression
comma character may appear. And finally `*` indicates, that this patter may be repetetive.

So for `vec![1, 2, 3];` this pattern will capture numbers 1, 2 and 3 repetitively. 

Inside of arm executable code we defined `$(...)*`, which means that code inside of it will be
emmitted for every `$( $x:expr )` pattern match.

That way, after this macro will generate actual Rust code, it will emit:

```rust
{
    let mut temp_vec = Vec::new();
    temp_vec.push(1);
    temp_vec.push(2);
    temp_vec.push(3);
    temp_vec
}
```

## References

- [Macros - The Rust Programming Language](https://doc.rust-lang.org/stable/book/ch19-06-macros.html)
