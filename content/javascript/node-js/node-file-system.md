---
title: Node.JS File System
date: "2022-04-24"
description: "Working with file system in Node.JS"
---

- [FS Module](#fs-module)
  - [Opening Files](#opening-files)
  - [Creating Files](#creating-files)
  - [Removing Files](#removing-files)
  - [Files Metadata](#files-metadata)
- [Stream API](#stream-api)
- [Plan](#plan)

## FS Module

`fs` is a `node.js` module providing access to the file system.

### Opening Files

Function `open` from `fs` allows to open file from file system. 

It has signature:

```ts
function open(
    path: PathLike, 
    flags: OpenMode, 
    callback: (err: NodeJS.ErrnoException | null, fd: number) => void
): void;
```

| Flag | Description                                                                |
| :--- | :------------------------------------------------------------------------- |
| r    | Open file for read. Throws exception if file doesn’t exists.               |
| r+   | Open file to read and write. Throws exception if file doesn’t exists.      |
| rs+  | Open file in synchronous mode to read and write.                           |
| w    | Open file for writing. File is created if it doesn’t exists.               |
| wx   | It is same as ‘w’ but fails if path exists.                                |
| w+   | Open file to read and write. File is created if it doesn’t exists.         |
| wx+  | It is same as ‘w+’ but fails if path exists.                               |
| a    | Open file to append. File is created if it doesn’t exists.                 |
| ax   | It is same as ‘a’ but fails if path exists.                                |
| a+   | Open file for reading and appending. File is created if it doesn’t exists. |
| ax+  | It is same as ‘a+’ but fails if path exists.                               |

If file does not exist, it will be created.

### Creating Files

To create new file and write data to it `fs.write()` is used:

```ts
function write<TBuffer extends NodeJS.ArrayBufferView>(
    fd: number,
    buffer: TBuffer,
    offset: number | undefined | null,
    length: number | undefined | null,
    position: number | undefined | null,
    callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void
): void;
```

Example:

```ts
function writeContentToFile(
  path: PathLike,
  content: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // open file in write mode
    fs.open(path, "w", (err, fd) => {
      if (err) {
        console.error(err);
        reject(err);
      }

      // write content into opened file
      fs.write(fd, content, (err, numberWritten, str) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log(`number written: ${numberWritten}, str: ${str}`);
        resolve();
      });
    });
  });
}
```

There is a simpler way to write file - `fs.writeFile()`:

```ts
  fs.writeFile( path, content, { encoding: "utf-8" }, (err) => {
      console.error(err);
    }
  );
```

`writeFile` has signature:

```ts
function writeFile(
    file: PathOrFileDescriptor, 
    data: string | NodeJS.ArrayBufferView, 
    options: WriteFileOptions, 
    callback: NoParamCallback
): void;
```

To append some data to an existing file or create new if file does not exist there is a method `fs.appendFile()`
with following signature:

```ts
function appendFile(
  path: PathOrFileDescriptor,
  data: string | Uint8Array,
  options: WriteFileOptions,
  callback: NoParamCallback
): void
```

where `callback` is of signature:

```ts
(err: NodeJS.ErrnoException | null) => void
```

In case of any error object `err` of the callback will contain error of type:

```ts
interface ErrnoException extends Error {
  errno?: number | undefined
  code?: string | undefined
  path?: string | undefined
  syscall?: string | undefined
}
```

### Removing Files

To remove file from file system use `fs.unlink`:

```ts
fs.unlink(path, (err) => {
  if (err) {
      console.log('File deleted!');
  }
});
```

### Files Metadata

To get file metadata use:

```ts
function stat(
    path: PathLike, 
    callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void
): void;
```

`Stats` object contains:

- `isFile(): boolean`
- `isDirectory(): boolean`
- `isBlockDevice(): boolean`
- `isCharacterDevice(): boolean`
- `isSymbolicLink(): boolean`
- `isFIFO(): boolean`
- `isSocket(): boolean`

To rename files there is a `fs.rename()` function:

```ts
fs.rename(existingFilePath, newFileName, (err) => {
  if (err) {
      console.log('File Renamed!');
  }
});
```

## Stream API

Stream is a way to transfer data continuously. It is especially useful with large data, which could not be
loaded into RAM otherwise.

`node:fs` module contains functions to operate streams over files. 

To create read stream:

```ts
const stream = fs.createReadStream(filePath);
```

`createReadStream` has signature:

```ts
function createReadStream(
    path: PathLike, 
    options?: BufferEncoding | ReadStreamOptions
): ReadStream;
```

To read data from create stream there is a `data` event, which should be listened:

```ts
stream.setEncoding("utf8");
stream.on("data", (data: string | Buffer) => {
    console.log(data);
});
```

To create write file stream there is a `fs.createWriteStream()` function:

```ts
const stream = fs.createWriteStream(path, {
    encoding: "utf-8",
});

for (let x = 0; x < 100; x++) {
    stream.write(`${x}\n`, (err) => {
        console.error(err);
    });
}
```

This example will write 100 lines with increasing numbers into file with path equal to `path` variable value.

Streams can be piped with other streams. For example we can create stream over http to download data
and pipe it to file stream to immediately write this data to file. For example:

```ts
axios.get<Readable>(url, { responseType: "stream" })
    .then(async (response) => {
        const fileWriteStream = fs.createWriteStream('./local-file');
        response.data.pipe(fileWriteStream);
    })
    .catch(error => console.error(error));
```

## Plan

- `path`
- `process.cwd()`