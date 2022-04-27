import * as fs from "./fs-acl";
import path from "node:path";

export const CONTENT_DIR = path.join(fs.CURRENT_DIR, "content");
export const FOLDERS_URL_ROOT = "/folders";

export function isPublicAsset(x: string): boolean {
  return !(x.startsWith(".") || x.startsWith("_"));
}

export function isNote(x: string): boolean {
  return x.endsWith(".md");
}

export function isPrivateAsset(x: string) {
  return !isPublicAsset(x);
}

export function getNoteLink(path: string) {
  return `/notes/${path.replace(".md", "")}`;
}
