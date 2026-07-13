import fs from 'fs';
import path from 'path';

export interface BaseMetadata {
  title: string;
  lede?: string;
  [key: string]: any;
}

export interface ContentItem<T extends BaseMetadata = BaseMetadata> {
  slug: string;
  type: string;
  metadata: T;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function parseFrontmatter<T extends BaseMetadata>(fileContent: string): { metadata: T; content: string } {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    return {
      metadata: { title: 'Untitled' } as T,
      content: fileContent,
    };
  }

  const frontmatterContent = match[1];
  const content = fileContent.replace(frontmatterRegex, '').trim();

  const metadata: any = {};
  const lines = frontmatterContent.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      metadata[key] = value;
    }
  }

  return { metadata: metadata as T, content };
}

export function getContentBySlug<T extends BaseMetadata>(type: string, slug: string): ContentItem<T> | null {
  try {
    const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { metadata, content } = parseFrontmatter<T>(fileContent);

    return {
      slug,
      type,
      metadata,
      content,
    };
  } catch (e) {
    return null;
  }
}

export function getAllContent<T extends BaseMetadata>(type: string): ContentItem<T>[] {
  try {
    const dirPath = path.join(CONTENT_DIR, type);
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.mdx'));

    return files.map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { metadata, content } = parseFrontmatter<T>(fileContent);

      return {
        slug,
        type,
        metadata,
        content,
      };
    });
  } catch (e) {
    return [];
  }
}
