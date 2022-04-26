export interface BlogAsset {
  title: string;
}

export interface DescribedBlogAsset extends BlogAsset {
  description: string;
}

export interface FileDescription {
  name: string;
  relPath: string;
  path: string;
}

export interface CategoryDescription extends BlogAsset {
  link: string;
}

export interface NoteDescription extends DescribedBlogAsset {
  date: string;
  link: string;
}


