---
title: Rust Package Management
date: "2022-03-03"
description: "Rust package management examples"
---

## Cargo

## Profiles

`release profiles` are predefined and customizable profiles with different configurations that allow a programmer to have more control over various options for compiling code.

- `dev` profile `cargo` uses when you run `cargo build` 
- `release` profile `cargo` uses when you run `cargo build --release`

Cargo has default settings for each of the profiles that apply when there aren’t any `[profile.*]` sections in the project’s `Cargo.toml` file.
By adding `[profile.*]` sections for any profile you want to customize, you can override any subset of the default settings.

```toml
[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3
```

The `opt-level` setting controls the number of optimizations Rust will apply to your code, with a range of 0 to 3. 

## Publishing

To publish modules into `crates.io` need at first to register on it with `github` account.
On the second step need to generate new API token. It is possible to do on `https://crates.io/settings/tokens`
page. Pressing `New Token` button, system will ask for a name of a new token and after will
return freshly generated token.

To use it run `cargo login <api-token>` in the terminal or CI. Then token will be stored inside of
`~/.cargo/credentials`.

To be eligible for publish on `crates.io`, package should have a unique name, have a description
and [license](https://spdx.org/licenses/).
It can be specified inside of `Cargo.toml` file:

```toml
[package]
name = "guessing_game"
version = "0.1.0"
edition = "2022"
description = "some package description"
license = "MIT"
```

After all metadata is set correctly run `cargo publish`. This will publish the package to the
`crates.io`.

Published packages could not be edited or removed. This is made to ensure that all code, using this
package will be functional in future. But it is pussible to mark package as depricated by
`cargo yank --vers 1.0.1` so future projects will not use it. `cargo yank --vers 1.0.1 --undo` will
do the opposite.

There is no limitation for publishing new version though. To do that required to change `version` 
in `Cargo.toml` file.
