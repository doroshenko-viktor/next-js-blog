export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getAssetDisplayName(assetName: string): string {
  return assetName.split(/_|-/).map(capitalize).join(" ");
}
