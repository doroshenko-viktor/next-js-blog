---
title: GraphQL
date: "2022-04-10"
description: "GraphQL basic terminology and fundamentals"
---

## Types

`GraphQL` schema consists of some basic types and it's combinations.

Basic scalar types are: `String`, `Int`, `Float`, `Boolean`, `ID`.

By default all types are nullable. `!` makes type not nullable, e.g. `Int!` can't be null.

**Lists:**

To define a list type need to surround core type in `[]` like `[Int!]` is a list of non-nullable integers.

