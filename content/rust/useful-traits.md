---
title: Rust Useful Traits
date: "2022-04-04"
description: "List of good to know common traits in Rust"
---

- [Comparison](#comparison)
  - [std::cmp::PartialEq](#stdcmppartialeq)
  - [std::cmp::PartialOrd](#stdcmppartialord)
- [Lifecycle](#lifecycle)
  - [std::ops::Drop](#stdopsdrop)
  - [std::future::Future](#stdfuturefuture)

## Comparison

### std::cmp::PartialEq

[Full Doc](https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#)

```rust
pub trait PartialEq<Rhs = Self>
where Rhs: ?Sized,
{
    fn eq(&self, other: &Rhs) -> bool;

    fn ne(&self, other: &Rhs) -> bool { ... }
}
```

Trait for equality comparisons which are partial equivalence relations.

`x.eq(y)` can also be written `x == y`, and `x.ne(y)` can be written `x != y`.

Implementations must ensure that `eq` and `ne` are consistent with each other.

This trait can be used with `#[derive]`. When derived on `structs`, two instances are equal if all fields are equal, and not equal if any fields are not equal. When derived on `enums`, each variant is equal to itself and not equal to the other variants.

### std::cmp::PartialOrd

[Full Doc](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html)

```rust
pub trait PartialOrd<Rhs = Self>: PartialEq<Rhs>
where Rhs: ?Sized,
{
    fn partial_cmp(&self, other: &Rhs) -> Option<Ordering>;

    fn lt(&self, other: &Rhs) -> bool { ... }
    fn le(&self, other: &Rhs) -> bool { ... }
    fn gt(&self, other: &Rhs) -> bool { ... }
    fn ge(&self, other: &Rhs) -> bool { ... }
}
```

Trait for values that can be compared for a sort-order.

The `lt`, `le`, `gt`, and ge methods of this trait can be called using the `<`, `<=`, `>`, and `>=` operators, respectively.

The methods of this trait must be consistent with each other and with those of `PartialEq` in the following sense:

`a == b` if and only if `partial_cmp(a, b) == Some(Equal)`.
`a < b` if and only if `partial_cmp(a, b) == Some(Less)` (ensured by the default implementation).
`a > b` if and only if partial_cmp(a, b) == Some(Greater) (ensured by the default implementation).
`a <= b` if and only if `a < b || a == b` (ensured by the default implementation).
`a >= b `if and only if `a > b || a == b `(ensured by the default implementation).
`a != b` if and only if `!(a == b)` (already part of PartialEq).

## Lifecycle

### std::ops::Drop

[Full Doc](https://doc.rust-lang.org/std/ops/trait.Drop.html)

Represents deconstructor for object, which will be called, when object is deleting.

```rust
struct HasDrop;

impl Drop for HasDrop {
    fn drop(&mut self) {
        println!("Dropping HasDrop!");
    }
}
```

e.g. `Box`, `Vec`, `String`, `File`, and `Process` implement the `Drop` trait to free resources.

### std::future::Future

[Full Doc](https://doc.rust-lang.org/std/future/trait.Future.html)


