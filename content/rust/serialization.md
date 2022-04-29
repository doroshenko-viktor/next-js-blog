---
title: Rust Serialization/Deserialization
date: "2022-03-03"
description: "Serialization and deserialization with Serde library"
---

## Attributes

## Container Attributes

These are `serde` attributes placed on top of target struct.

- `#[serde(rename_all = "<value>")]` - this attribute allows to specify format of `json` keys.
  Possible `<value>`s are:

  - `lowercase`
  - `UPPERCASE`
  - `PascalCase`
  - `camelCase`
  - `snake_case`
  - `SCREAMING_SNAKE_CASE`
  - `kebab-case`
  - `SCREAMING-KEBAB-CASE`

  ```rust
    //{
    //    \"someKey1\": \"v1\",
    //    \"someKey2\": 8
    //}

    #[derive(Deserialize, Serialize, Debug)]
    #[serde(rename_all = "camelCase")]
    struct T {
        pub some_key_1: String,
        pub some_key_2: u8,
    }
  ```

## Field Attributes

These are attributes, placed on fields of `structs` or `enum` variants:

- **rename:** - allows to rename some field on serialization/deserialization and separately
  for each of them:

  ```rust
    #[derive(Deserialize, Serialize, Debug)]
    struct T {
        #[serde(rename(serialize = "SERIALIZE_KEY", deserialize = "other_KEY"))]
        pub some_key_1: String,
        #[serde(rename = "key2")]
        pub some_key_2: u8,
    }

    let json = "{
        \"other_KEY\": \"v1\",
        \"key2\": 8
    }";

    let t: T = serde_json::from_str(&json)?;
    dbg!(&t);
    let serialized = serde_json::to_string(&t)?;
    dbg!(&serialized);
    Ok(serialized)
  ```

  where `serialized` will be:

  ```rust
  {"SERIALIZE_KEY":"v1","key2":8}
  ```

- **alias:** - specifies possible alias for property name, but it leaves possibility to 
  serialize/deserialize also with native Rust's struct field name.
- **skip:** - don't serialize/deserialize specified field. It has also more narrow `skip_serializing` 
  and `skip_deserializing`.

