import fs, { ObjectType } from "./fs-acl";
import path from "path";

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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getAssetDisplayName(assetName: string): string {
  return assetName.split(/_|-/).map(capitalize).join(" ");
}

export async function getFolderDetails(
  folderPath: string[]
): Promise<SeparationResult> {
  const joinedPath = path.join(CONTENT_DIR, ...folderPath);
  const folderAssets: FolderAsset[] = (
    await fs.getFolderContentList(joinedPath)
  ).map((x) => {
    return {
      name: x,
      displayName: getAssetDisplayName(x),
      path: path.join(joinedPath, x),
    };
  });

  const separated = await separateFilesAndDirs(folderAssets);
  separated.files = separated.files.map((file) => {
    return {
      ...file,
      displayName: file.displayName.replace(".md", ""),
    };
  });
  return separated;
}

export type SeparationResult = {
  files: FolderAsset[];
  dirs: FolderAsset[];
};

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
  getFolderDetails,
};

export default exports;
