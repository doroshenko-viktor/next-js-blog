import path from "path";
import { ObjectType } from "./fs-acl";
import * as fs from "./fs-acl";
import * as assetsService from "./assets";
import { FileDescription } from "./types";

export interface FolderAsset {
  name: string;
  path: string;
}

export async function getFolderAssetPaths(): Promise<string[]> {
  return await getFolderAssetPathsRec([]);
}

export async function getFolderAssetPathsRec(
  root: string[]
): Promise<string[]> {
  const joinedPath = path.join(assetsService.CONTENT_DIR, ...root);

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
    ...directories.map((dir) =>
      path.join(assetsService.FOLDERS_URL_ROOT, ...root, dir)
    ),
    ...subDirectories,
  ];
}

export type BlogAssets = {
  notes: FileDescription[];
  categories: FileDescription[];
};

export async function getFolderAssetsSeparated(
  folderPath: string[]
): Promise<BlogAssets> {
  const joinedPath = path.join(assetsService.CONTENT_DIR, ...folderPath);
  const folderAssetNames = await fs.getFolderContentList(joinedPath);
  const folderAssets: FileDescription[] = folderAssetNames
    .filter(assetsService.isPublicAsset)
    .map((x) => {
      return {
        name: x,
        relPath: path.join(...folderPath, x),
        path: fs.getFullPath(joinedPath, x),
      };
    });

  const separated = await separateFilesAndDirs(folderAssets);
  return separated;
}

async function separateFilesAndDirs(
  assets: FileDescription[]
): Promise<BlogAssets> {
  const result: BlogAssets = {
    categories: [],
    notes: [],
  };

  for (const asset of assets) {
    const type = await fs.getType(asset.path);

    if (type === ObjectType.Directory) {
      result.categories.push(asset);
    }
    if (type === ObjectType.File) {
      result.notes.push(asset);
    }
  }

  return result;
}
