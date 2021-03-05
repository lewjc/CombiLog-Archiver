import { v4 as uuid } from "uuid";

import fs, { Dirent } from "fs";
import path from "path";

export function createLogFile(directory: string, fileName: string) {
  const filePath = path.join(directory, fileName);
  if (!fs.existsSync(filePath)) {
    fs.closeSync(fs.openSync(filePath, "w"));
  }
}

export function writeToLogFile(
  directory: string,
  fileName: string,
  content: string
) {
  const filePath = path.join(directory, fileName);

  if (!fs.existsSync(directory)) {
    createDirectory(directory, "");
  }

  if (!fs.existsSync(filePath)) {
    createLogFile(directory, fileName);
  }

  fs.appendFileSync(filePath, `${content}\n`);
}

export function createDirectory(parent: string, dir: string) {
  const directoryPath = path.join(parent, dir);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
}

export async function getFileContents(path: string): Promise<string | null> {
  return fs.promises.readFile(path, { encoding: "utf-8" }).catch((err) => {
    console.error(err);
    return null;
  });
}

export async function getLogStructure(dir: string): Promise<object | null> {
  try {
    let files = await getFiles(dir);
    files = files.map((file: string) => standardisePath(dir, file));
    const treeStucture: any = {
      id: "root",
      name: "root",
      children: [],
    };

    files.forEach((filePath: string) => {
      const paths = filePath.split("/");
      const isServiceLog = paths[1] === "service";
      paths.forEach((pathItem: string, idx: number) => {
        let ref = treeStucture;
        switch (idx) {
          case 0: {
            ref.name = pathItem;
            break;
          }
          case 1: {
            if (
              ref.children.filter((x: any) => x.name === pathItem).length === 0
            ) {
              ref.children.push({
                id: uuid(),
                name: pathItem,
                children: [],
              });
            }
            break;
          }
          case 2: {
            const parent = ref.children
              .filter((x: any) => x.name === paths[idx - 1])
              .pop();
            if (
              parent.children.filter((x: any) => x.name === pathItem).length ===
              0
            ) {
              const treeItem: any = {
                id: uuid(),
                name: pathItem,
              };

              if (!isServiceLog) {
                treeItem["viewable"] = true;
                treeItem["path"] = filePath;
              } else {
                treeItem["children"] = [];
              }

              parent.children.push(treeItem);
            }
            break;
          }
          case 3: {
            const treeItem: any = {
              id: uuid(),
              name: pathItem,
            };
            treeItem["viewable"] = true;
            treeItem["path"] = filePath;

            const parent = ref.children
              .filter((x: any) => x.name === paths[idx - 2])
              .pop()
              .children.filter((x: any) => x.name === paths[idx - 1])
              .pop();
            parent.children.push(treeItem);
            break;
          }
        }
      });
    });
    return treeStucture;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getFiles(dir: string) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files: any = await Promise.all(
    dirents.map((dirent: Dirent): any => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

export function checkHotRecords() {
  // If there is a record hot record is from yesterday, we need to move it into archive
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  if (process.env.COMBILOG_ARCHIVE_ROOT) {
    let archiveRoot = process.env.COMBILOG_ARCHIVE_ROOT;
    let hotDir = path.join(archiveRoot, "hot");
    let files = fs.readdirSync(hotDir);
    files.forEach((file) => {
      const dateString = file.replace(".log", "");
      const logDate = new Date(dateString);
      logDate.setDate(logDate.getDate() + 4);
      if (logDate < today) {
        const currentPath = path.join(hotDir, file);
        const newPath = path.join(archiveRoot, "archive", file);
        console.log(
          `Archiving file ${currentPath} to ${newPath}. No longer hot.`
        );
        fs.renameSync(currentPath, newPath);
      }
    });
  }
}

function standardisePath(dir: string, file: string): string {
  return file
    .replace(dir, dir.replace(/\\\\/g, "\\").split(path.sep).pop() ?? "")
    .replace(/\\/g, "/");
}
