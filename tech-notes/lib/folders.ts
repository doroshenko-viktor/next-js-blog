import path from "path";
import { ObjectType } from "./fs-acl";
import * as fs from "./fs-acl";
import * as formatting from "./formatting";

const CONTENT_DIR = path.join(fs.CURRENT_DIR, "content");
const FOLDERS_URL_ROOT = "/folders";

export type FolderAsset = {
  name: string;
  displayName: string;
  path: string;
};

export async function getFolderAssetPaths(): Promise<string[]> {
  return await getFolderAssetPathsRec([]);
}

export async function getFolderAssetPathsRec(
  root: string[]
): Promise<string[]> {
  const joinedPath = path.join(CONTENT_DIR, ...root);
  console.log("root:");
  console.dir(root);

  const assets = await fs.getFolderContentList(joinedPath);

  const directories: string[] = [];
  for (const asset of assets) {
    const assetPath = path.join(joinedPath, asset);
    const type = await fs.getType(assetPath);
    if (type === ObjectType.Directory) {
      directories.push(asset);
    }
  }

  const subDirectories: string[] = [];
  for (const dir of directories) {
    const currentSubDirectories = await getFolderAssetPathsRec([...root, dir]);
    subDirectories.splice(subDirectories.length, 0, ...currentSubDirectories);
  }

  return [
    ...directories.map((dir) => path.join(FOLDERS_URL_ROOT, ...root, dir)),
    ...subDirectories,
  ];
}

export async function getFolderAssetsSeparated(
  folderPath: string[]
): Promise<SeparationResult> {
  const joinedPath = path.join(CONTENT_DIR, ...folderPath);
  const folderAssetNames = await fs.getFolderContentList(joinedPath);
  const folderAssets = folderAssetNames
    .filter(isPublicAsset)
    .map(getFolderAssetFactory(joinedPath));

  const separated = await separateFilesAndDirs(folderAssets);
  separated.files = separated.files.map((file) => {
    return {
      ...file,
      displayName: file.displayName.replace(".md", ""),
    };
  });
  return separated;

  function getFolderAssetFactory(joinedPath: string) {
    return (x: string): FolderAsset => ({
      name: x,
      displayName: formatting.getAssetDisplayName(x),
      path: path.join(joinedPath, x),
    });
  }
}

export type SeparationResult = {
  files: FolderAsset[];
  dirs: FolderAsset[];
};

function isPublicAsset(x: string): boolean {
  return !(x.startsWith(".") || x.startsWith("_"));
}

async function separateFilesAndDirs(
  assets: FolderAsset[]
): Promise<SeparationResult> {
  const result: SeparationResult = {
    dirs: [],
    files: [],
  };

  for (const asset of assets) {
    const type = await fs.getType(asset.path);
    if (type === ObjectType.Directory) {
      result.dirs.push(asset);
    }
    if (type === ObjectType.File) {
      result.files.push(asset);
    }
  }

  return result;
}

const exports = {
  getFolderAssetPaths,
  getFolderAssetsSeparated,
};

export default exports;
