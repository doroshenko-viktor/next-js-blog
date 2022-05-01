import * as assetsService from "./assets";
import * as fs from "./fs-acl";
import matter, { GrayMatterFile } from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { rehype } from "rehype";
import rehypeHighlight from "rehype-highlight";
import {
  DescribedBlogAsset,
  FileDescription,
  NoteContent,
  NoteDescription,
} from "./types";
import { NoteParseError } from "./errors";
import path from "path";

interface NoteDescriptionVerbose extends DescribedBlogAsset {
  date: Date;
  link: string;
}

export const getNoteContent = async (
  noteRelPath: string
): Promise<NoteContent> => {
  const noteFullPath = path.join(assetsService.CONTENT_DIR, noteRelPath);
  const fileContent = await fs.getFileContent(noteFullPath);
  const parsedNote = parseNoteMetadata(fileContent, noteRelPath);
  return await getNoteContentFromParsed(parsedNote);
};

async function getNoteContentFromParsed({
  data,
  content,
}: GrayMatterFile<string>): Promise<NoteContent> {
  let formattedContent = await remark().use(remarkHtml).process(content);

  const blogHtmlContent = await rehype()
    .data("settings", { fragment: true })
    .use(rehypeHighlight)
    .process(formattedContent);
  return {
    title: data.title,
    date: data.date,
    content: blogHtmlContent.toString(),
  };
}

export const getAllNotesPaths = async () => {
  const contentPath = assetsService.CONTENT_DIR;
  return await getAllNotesPathsRec(contentPath, "");

  async function getAllNotesPathsRec(
    contentRoot: string,
    relPath: string
  ): Promise<string[]> {
    const assets = await fs.getFolderContentList(
      path.join(contentRoot, relPath)
    );

    const notesPaths: string[] = [];

    for (const asset of assets) {
      if (assetsService.isPrivateAsset(asset)) continue;
      const assetRelPath = path.join(relPath, asset);
      const assetType = await fs.getType(path.join(contentRoot, assetRelPath));

      if (assetType === fs.ObjectType.Directory) {
        const dirNotesPaths = await getAllNotesPathsRec(
          contentRoot,
          assetRelPath
        );
        notesPaths.push(...dirNotesPaths);
      }
      if (assetType === fs.ObjectType.File) {
        const noteLink = assetsService.getNoteLink(assetRelPath);
        notesPaths.push(noteLink);
      }
    }

    return notesPaths;
  }
};

export const getFolderNotesDetails = async (
  folderRelPath: string
): Promise<NoteDescription[]> => {
  const isPublicNote = (x: FileDescription) => {
    return assetsService.isPublicAsset(x.name) && assetsService.isNote(x.name);
  };

  const files = (
    await fs.getFolderFiles(assetsService.CONTENT_DIR, folderRelPath)
  ).filter(isPublicNote);

  const notesDescriptions: NoteDescription[] = [];
  for (const file of files) {
    const fileContent = await fs.getFileContent(file.path);
    const parsed = parseNoteMetadata(fileContent, file.name, file.relPath);
    notesDescriptions.push({
      title: parsed.data.title,
      date: parsed.data.date,
      description: parsed.data.description,
      link: assetsService.getNoteLink(file.relPath),
    });
  }

  return notesDescriptions;
};

export const getLastNotesDetails = async (
  limit: number
): Promise<NoteDescription[]> => {
  const files = fs.streamAllFilePaths(assetsService.CONTENT_DIR, "");
  const notes = await getPublicNotes(files);

  notes.sort(notesAgeComparator);

  return notes.slice(0, limit).map((x) => ({
    title: x.title,
    description: x.description,
    date: x.date.toString(),
    link: x.link,
  }));

  async function getPublicNotes(files: AsyncGenerator<FileDescription>) {
    const publicNotes: NoteDescriptionVerbose[] = [];

    for await (const { name, path, relPath } of files) {
      if (assetsService.isPrivateAsset(name) && !assetsService.isNote(name)) {
        continue;
      }

      const fileContent = await fs.getFileContent(path);
      const parsed = parseNoteMetadata(fileContent, relPath);

      const note: NoteDescriptionVerbose = {
        title: parsed.data.title,
        description: parsed.data.description,
        date: new Date(parsed.data.date),
        link: assetsService.getNoteLink(relPath),
      };

      if (!isNoteDescriptionValid(note)) {
        continue;
      }

      publicNotes.push(note);
    }

    return publicNotes;
  }

  function isNoteDescriptionValid(note: NoteDescriptionVerbose) {
    if (!note.title || !note.description || !note.date) return false;
    return true;
  }
};

function parseNoteMetadata(note: string, relPath: string) {
  try {
    return matter(note);
  } catch (err) {
    throw new NoteParseError("Error parsing note", relPath, err as Error);
  }
}

function notesAgeComparator(
  a: NoteDescriptionVerbose,
  b: NoteDescriptionVerbose
) {
  if (a.date > b.date) {
    return -1;
  } else {
    return 1;
  }
}
