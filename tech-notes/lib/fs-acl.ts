import fs, { PathLike } from "fs";

export const CURRENT_DIR = process.cwd();

/**
 * get list of contents inside of a given directory
 * @param path path to the object
 * @returns list of paths in the provided directory
 */
export const getFolderContentList = (path: PathLike): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, content) => {
      if (err) {
        reject(err);
      }
      resolve(content);
    });
  });
};

export enum ObjectType {
  Directory,
  File,
  Other,
}

/**
 * Get type of given object in file system
 * @param path path to object
 * @returns ObjectType
 */
export const getType = (path: PathLike): Promise<ObjectType> => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (stats.isDirectory()) {
        return resolve(ObjectType.Directory);
      }
      if (stats.isFile()) {
        return resolve(ObjectType.File);
      }
      resolve(ObjectType.Other);
    });
  });
};

const module = {
  CURRENT_DIR,
  ObjectType,
  getFolderContentList,
  getType,
};

export default module;
