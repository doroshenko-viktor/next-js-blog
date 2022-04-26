import { CategoryDescription, FileDescription } from "./types";
import * as formattingService from "./formatting";

export function getCategoriesDescriptions(
  categories: FileDescription[]
): CategoryDescription[] {
  return categories.map((x) => {
    return {
      title: formattingService.getFolderDisplayName(x.name),
      link: "/folders/" + x.relPath,
    };
  });
}
