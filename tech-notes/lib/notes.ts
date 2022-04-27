import * as assetsService from "./assets";
import * as fs from "./fs-acl";
import matter from "gray-matter";
import { DescribedBlogAsset, FileDescription, NoteDescription } from "./types";
import { NoteParseError } from "./errors";
import path from "path";

interface NoteDescriptionVerbose extends DescribedBlogAsset {
  date: Date;
  link: string;
}

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
      link: file.relPath,
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
      const parsed = parseNoteMetadata(fileContent, name, relPath);

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

function parseNoteMetadata(note: string, name: string, relPath: string) {
  try {
    return matter(note);
  } catch (err) {
    throw new NoteParseError("Error parsing note", name, relPath, err as Error);
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
