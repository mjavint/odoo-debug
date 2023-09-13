import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getIconFileName, buscarCarpetasAddonsEnLista } from "./utils";

export class FileExplorerProvider implements vscode.TreeDataProvider<FileItem> {
  private excludeExtensions: string[];
  private excludeDirectories: string[];
  private rootPaths: string[] = []; // Lista de rutas raíz

  constructor(rootPaths: string[]) {
    this.excludeExtensions = [".pyc", ".pyo"];
    this.excludeDirectories = ["__pycache__"];
    this.rootPaths = buscarCarpetasAddonsEnLista(rootPaths);
  }

  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: FileItem): Promise<FileItem[]> {
    if (!element) {
      // Si no se proporciona un elemento, devolvemos las rutas raíz como nodos
      return this.rootPaths.map(
        (rootPath) => new FileItem(rootPath, true, vscode.Uri.file(rootPath))
      );
    }

    // Si se proporciona un elemento, devolvemos los contenidos de la carpeta correspondiente
    const currentPath = element.resourceUri.fsPath;

    try {
      const subdirectories = await this.getAddonSubdirectories(currentPath);

      const items: FileItem[] = [];

      for (const subdirectory of subdirectories ?? []) {
        const subdirectoryPath = path.join(currentPath, subdirectory);
        const isDirectory = (
          await fs.promises.stat(subdirectoryPath)
        ).isDirectory();

        items.push(
          new FileItem(
            subdirectory,
            isDirectory,
            vscode.Uri.file(subdirectoryPath)
          )
        );
      }

      return items;
    } catch (err) {
      vscode.window.showErrorMessage(`Error al obtener elementos: ${err}`);
      return [];
    }
  }

  addRootPaths(paths: string[]) {
    // Agrega las rutas que tengan una subcarpeta llamada "addons"
    for (const path of paths) {
      if (this.hasAddonSubdirectory(path)) {
        this.rootPaths.push(path);
      }
    }
  }

  private async getAddonSubdirectories(rootPath: string) {
    try {
      const subdirectories = await fs.promises.readdir(rootPath);

      // Filtra solo los subdirectorios que tienen como nombre "addons"
      return subdirectories.filter(async (subdirectory) => {
        const subdirectoryPath = path.join(rootPath, subdirectory);
        const isDirectory = (
          await fs.promises.stat(subdirectoryPath)
        ).isDirectory();
        return isDirectory && subdirectory.toLowerCase() === "addons";
      });
    } catch (err) {
      vscode.window.showErrorMessage(`Error al obtener subdirectorios: ${err}`);
    }
  }

  private hasAddonSubdirectory(rootPath: string): boolean {
    const subdirectories = fs.readdirSync(rootPath);

    // Verifica si hay una subcarpeta llamada "addons"
    return subdirectories.some((subdirectory) =>
      subdirectory.toLowerCase().includes("addons")
    );
  }
}

export class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly isDirectory: boolean,
    public readonly resourceUri: vscode.Uri
  ) {
    super(
      label, // Mostrará el nombre de la carpeta en lugar de la ruta completa
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
