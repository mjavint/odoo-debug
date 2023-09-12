import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getIconFileName } from "./utils";

export class FileExplorerProvider implements vscode.TreeDataProvider<FileItem> {
  private excludeExtensions: string[];
  private excludeDirectories: string[];
  constructor(private readonly rootPath: string) {
    this.excludeExtensions = [".pyc", ".pyo"];
    this.excludeDirectories = ["__pycache__"];
  }

  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: FileItem): Promise<FileItem[]> {
    const currentPath = element ? element.resourceUri.fsPath : this.rootPath;

    try {
      const files = await fs.promises.readdir(currentPath);

      const items: FileItem[] = [];

      for (const file of files) {
        const filePath = path.join(currentPath, file);
        const isDirectory = (await fs.promises.stat(filePath)).isDirectory();

        // Verifica si la extensión está en la lista de exclusiones
        const fileExtension = path.extname(file).toLowerCase();
        const directoryName = path.basename(filePath);

        if (
          !this.excludeExtensions.includes(fileExtension) &&
          !this.excludeDirectories.includes(directoryName)
        ) {
          items.push(
            new FileItem(file, isDirectory, vscode.Uri.file(filePath))
          );
        }
      }

      return items;
    } catch (err) {
      vscode.window.showErrorMessage(`Error al obtener elementos: ${err}`);
      return [];
    }
  }
}

export class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly isDirectory: boolean,
    public readonly resourceUri: vscode.Uri
  ) {
    super(
      label,
      isDirectory
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );

    this.iconPath = {
      light: path.join(__filename, "..", "resources", getIconFileName(label)),
      dark: path.join(__filename, "..", "resources", getIconFileName(label)),
    };

    // Método para manejar la acción cuando se hace clic en el elemento
    this.command = isDirectory
      ? undefined
      : {
          title: "Abrir en el editor",
          command: "odoo-debug.openFile",
          arguments: [this.resourceUri],
        };
  }
}
