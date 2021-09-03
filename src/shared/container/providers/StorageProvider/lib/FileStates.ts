import storageConfig from '@config/storage';
import fs from 'fs-extra';
import { join } from 'path';

export async function DeleteFile(file: {
  folder: string;
  path: string;
}): Promise<void> {
  const filePath = join(storageConfig.disk.private[file.folder], file.path);
  /*
  CHECK IF FILE EXISTS
  */
  const fileExists = await fs.pathExists(filePath);

  if (fileExists) {
    try {
      /*
      DELETE FILE
      */
      await fs.promises.unlink(filePath);
    } catch {
      return;
    }
  }
}

export async function CopyFiles(
  srcDir: string,
  destDir: string,
  files: string[]
): Promise<void[]> {
  return Promise.all(
    files.map(f => {
      return fs.promises.copyFile(join(srcDir, f), join(destDir, f));
    })
  );
}
