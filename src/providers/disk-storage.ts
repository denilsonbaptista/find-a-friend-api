import fs from 'node:fs'
import path from 'node:path'
import { TMP_FOLDER, UPLOADS_FOLDER } from '@/config/upload'

export class DiskStorage {
  async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOADS_FOLDER, file)
    )

    return file
  }

  async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(UPLOADS_FOLDER, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}
