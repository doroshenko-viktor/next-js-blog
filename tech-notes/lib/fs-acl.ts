/**
 * Standard Node `fs` anticorruption layer
 */
import fs, { PathLike } from "fs";
import path from "node:path";
import { FileDescription } from "./types";

export const CURRENT_DIR = process.cwd();

export function getRootRelativePath(root: string, tailPath: string): string {
  return path.join(root, tailPath);
}

export function getFullPath(root: string, relativePath?: string): string {
  if (!relativePath) return root;
  return path.join(root, relativePath);
}

export async function* streamAllFilePaths(
  contentPath: string,
  currentRoot?: string
): AsyncGenerator<FileDescription> {
  const fullPath = getFullPath(contentPath, currentRoot);
  const assetList = await getFolderContentList(fullPath);

  for (const asset of assetList) {
    const relativePath =
      (currentRoot && getRootRelativePath(currentRoot, asset)) || asset;
    const assetFullPath = getFullPath(fullPath, asset);
    const assetType = await getType(assetFullPath);

    if (assetType === ObjectType.File) {
      yield {
        name: asset,
        relPath: relativePath,
        path: assetFullPath,
      };
    }
    if (assetType === ObjectType.Directory) {
      for await (const file of streamAllFilePaths(contentPath, relativePath)) {
        yield file;
      }
    }
  }
}

/**
 * read specified file content
 * @param filePath path to reading file
 * @returns string content of file encoded in utf-8
 */
export const getFileContent = async (filePath: PathLike): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.toString("utf-8"));
    });
  });
};

/**
 * get list of contents inside of a given directory
 * @param path path to the object
 * @returns list of paths in the provided directory
 */
export const getFolderContentList = async (
  path: PathLike
): Promise<string[]> => {
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
