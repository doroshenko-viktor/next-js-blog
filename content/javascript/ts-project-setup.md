---
title: JavaScript/TypeScript Project Setup
date: "2022-03-20"
description: "Setting up basic projects with ESLint, Prettier and Jest"
---

## Initializing Project

First of all initialize npm project:

```bash
npm init -y
```

Then install some `typescript`, types for `node.js`, linter and prettier:

```bash
npm install --save-dev typescript @types/node
```

Now initialize `typescript` project:

```bash
npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs false --noImplicitAny true
```

Some of important `tsconfig.json` options:

- `rootDir`: This is where `typescript` looks for source code. We've configured it to look in the `src/` folder.
- `outDir`: Where TypeScript puts compiled code. In our case it will be placed inside `build/` folder.
- `esModuleInterop`: If we're using `commonjs` as a module system for `node.js`, then we need this to be set to be `true`.
- `resolveJsonModule`: If we use `json` in this project, this option allows `typescript` to use it.
- `lib`: This option adds ambient types to the project, allowing to rely on features from different `ecmascript` versions, testing libraries or browser `DOM` api.
- `module`: `commonjs` is the standard `node.js` module system.
- `allowJs`: this option allows you to include `.js` files among `.ts` ones.
- `noImplicitAny`: In `typescript` files, don't allow a type to not specify type. Every type needs to have a specific type or explicitly declare `any` type.
- `sourceMap`: Create type maps for better debug experience.
- `strict`: Strict mode including strict null checking, strict functional types, check, that `bind`, `call` and `apply` match function's signature,
  check for not initialized constructor properties.

This should create roughly similar `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "lib": ["es6"],
    "module": "commonjs",
    "rootDir": "src",
    "resolveJsonModule": true,
    "allowJs": true,
    "sourceMap": true,
    "outDir": "build",
    "removeComments": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "skipLibCheck": true
  }
}
```

### Some Additional `tsconfig.json` Sections

**Exclude:**

`exclude` section defines paths, which will be excluded from the compilation:

```json
{
  "exclude": [
    "node_modules", // exclude node_modules. excluded by default if no `exclude` section specified
    "path-to-file-or-folder-to-exclude",
    "**/*.dev.ts" // exclude all files with specified extension in any folder
  ]
}
```

**Include:**

`include` section works the same as `exclude` but to include specified patterns into compilation.

**Files:**

`files` section specifies concrete files to compile.

**AllowJs && CheckJs:**

`allowJs` and `checkJs` options enable support for `js` validation inside of `ts` projects.

**Specifying Of Compiled Files Source And Destination:**

`outDir` value used to specify the destination folder of compiled `*.ts` files.
`rootDir` specifies the root of target files to compile. Only files from inside of this root will be compiled.

**Other Options:**

- `removeComments` - not include comments into compiled `*.js` files.
- `noEmit` - compile and check source files, but not create compiled `*.js` files.
- `noEmitOnError` - not emit compiled `js` when compilation error occurs.

## Compilation

To compile created project run:

```bash
npx tsc #compile project
npx tsc -w #set compiler to watch mode; (--watch)
```

Running `*.ts` file without compilation to js:

```bash
npm install --save-dev ts-node nodemon

npx tsc <file-name>.ts
```

**With monitoring:**

Create `nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "ts-node ./src/index.ts"
}
```

And also let's add run configuration into `package.json`:

```json
"scripts": {
    "start:dev": "nodemon"
}
```

## Linting

First install `eslint` package and some of it's supplement packages:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Create `.eslintrc` file:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

To ignore some files or folders like `node_modules` during linting create [`.eslintignore`](https://eslint.org/docs/user-guide/configuring/ignoring-code):

```text
node_modules/
build/
**/*.js
```

Add lint script to `package.json` scrypts:

```json
"lint": "eslint . --ext .ts",
```

**Additional Linting Configuration:**

There are three modes for a rule in `eslint`:

- `off` - 0
- `warn` - 1
- `error` - 2

There is a documentation on [rules reference](https://eslint.org/docs/rules/).
For example to restrict usage of `console.log`:

```json
"rules": {
  "no-console": 2 // this will lead to displaying an error on console.log
}
```

## Formatting

To format `typescript` code we will use `prettier` library:

Install it:

```bash
npm install --save-dev prettier
```

<!-- prettier eslint eslint-config-prettier eslint-plugin-prettier -->

Then create `prettier` configuration file - `.prettierrc` in the root of the project:

```json
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 80
}
```

- `semi` set to true means that `prettier` will add semicolons when necessary.
- `trailingComma` set to none means that `prettier` will remove any trailing commas at the end of objects.
- `singleQuote` set to true means that `prettier` will automatically use single quotes instead of double quotes.
- `printWidth` set to 80 specifies that the printer will wrap any lines that exceed 80 characters.

More `prettier` [rules](https://prettier.io/docs/en/options.html)

Add formatting command to `package.json` scrypts:

```json
"format": "prettier --config .prettierrc 'src/**/*.ts' --write"
```

**Conflicts with ESLint:**

There probably will be conflicts between `prettier` formatting and and `eslint`. To make these two love each other install:

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

- `eslint-config-prettier`: Turns off all `eslint` rules that have the potential to interfere with `prettier` rules.
- `eslint-plugin-prettier`: Turns `prettier` rules into `eslint` rules.

Lastly, we need to make an adjustment to the `.eslintrc`.

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {}
}
```

## Testing

For tests we will use `Jest` testing framework. To install it:

```bash
npm install --save-dev npm install --save-dev jest @types/jest ts-jest jest @types/jest ts-jest
```

And create a configuration file for `jest`:

```bash
npx ts-jest config:init
```

Modify content so:

```js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1",
  },
  testRegex: "((/__tests__/).*|(\\.|/)(test|spec))\\.(ts|js)$",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts}", "!src/**/*.d.ts"],
}
```

Here `testRegex` allows to discover test files.

Add testing scripts to `package.json`:

```json
"test": "jest --coverage",
"test:watch": "jest --coverage --watchAll",
```

To use test discovery in `Visual Studio Code` [Jest Test Explorer](https://marketplace.visualstudio.com/items?itemName=kavod-io.vscode-jest-test-adapter)
seems quite a good extension.
