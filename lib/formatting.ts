export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getFolderDisplayName(assetName: string): string {
  return assetName.split(/_|-/).map(capitalize).join(" ");
}
