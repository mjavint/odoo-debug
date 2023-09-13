import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { FileExplorerProvider } from "./providers";

import {
  launchDebug,
  launchWithoutDebug,
  launchChrome,
} from "./launchConfiguration";
import * as launch from "./constants";
import { getNewOdooConfigPath, getOdooConfiguration } from "./utils";

let { odooConfigPath, odooBinPath } = getOdooConfiguration();

// Command to run the Odoo server debug
export const debugServer = vscode.commands.registerCommand(
  "odoo-debug.debugServer",
  async () => {
    try {
      if (odooConfigPath !== "") {
        await vscode.debug.startDebugging(undefined, launchDebug);
        vscode.window.showInformationMessage(
          "The debug was successfully executed on the Odoo server"
        );
      } else {
        vscode.window.showErrorMessage(
          "There is no Odoo configuration file. Check the configuration and available commands."
        );
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        "Failed to run custom Odoo configuration. Check the configuration and available commands."
      );
    }
  }
);

// Command to run the Odoo server debug
export const startServer = vscode.commands.registerCommand(
  "odoo-debug.startServer",
  async () => {
    try {
      if (odooConfigPath !== "") {
        await vscode.debug.startDebugging(undefined, launchWithoutDebug);
        vscode.window.showInformationMessage(
          "The Odoo server debug was successfully executed"
        );
      } else {
        vscode.window.showErrorMessage(
          "There is no Odoo configuration file. Check the configuration and available commands."
        );
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        "Failed to run custom Odoo configuration. Check the configuration and available commands."
      );
    }
  }
);

function openChrome(cmdName: string, mode: number) {
  return vscode.commands.registerCommand(cmdName, async () => {
    try {
      // Ejecuta el comando personalizado con la configuración
      await vscode.debug.startDebugging(undefined, launchChrome(mode));
      vscode.window.showInformationMessage(
        `${cmdName} from Odoo was executed successfully.`
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `The command ${cmdName} could not be executed. Check the configuration and available commands.`
      );
    }
  });
}

// Defines a command to open a file explorer
export const openFileExplorer = vscode.commands.registerCommand(
  "odoo-debug.openFileExplorer",
  async () => {
    const newOdooConfigPath = await getNewOdooConfigPath(); // Función para obtener la nueva configuración

    if (newOdooConfigPath) {
      // Actualiza la variable global o el lugar donde se almacena la configuración
      odooConfigPath = newOdooConfigPath;
      // Actualiza la configuración en el espacio de trabajo
      await vscode.workspace
        .getConfiguration()
        .update(
          "odoo-debug.odooConf",
          newOdooConfigPath,
          vscode.ConfigurationTarget.Workspace
        );

      // Realiza las acciones que necesites con la nueva configuración
      // Por ejemplo, puedes actualizar alguna funcionalidad de tu extensión
      // ...
    }

    // Abre el archivo con la nueva configuración
    if (odooConfigPath) {
      const fileConf = vscode.Uri.file(odooConfigPath);
      if (fileConf.fsPath !== "/") {
        vscode.window.showTextDocument(fileConf);
      }
    }
  }
);

export const debugJS = openChrome("odoo-debug.debugJS", launch.MODE_DEBUG_JS);
export const debugOdoo = openChrome("odoo-debug.debugOdoo", launch.MODE_DEBUG);

export const openExplorer = vscode.commands.registerCommand(
  "odoo-debug.openExplorer",
  async () => {
    // Ruta de la carpeta de Odoo configurada por el usuario

    if (!odooBinPath) {
      vscode.window.showErrorMessage("La ruta de Odoo no está configurada.");
      return;
    }

    // Crea un TreeDataProvider para mostrar la lista de archivos y subdirectorios
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const rootPaths =
      workspaceFolders?.map((folder) => folder.uri.fsPath) ?? [];

    const fileExplorerProvider = new FileExplorerProvider(rootPaths);

    // Registra el TreeDataProvider en la vista del Sidebar Explorer
    vscode.window.registerTreeDataProvider(
      "odoo-debug.fileExplorer",
      fileExplorerProvider
    );

    // Abre la vista en el Sidebar openFolderWithAddons
    vscode.commands.executeCommand("explorer.openToSide");

    // Muestra un mensaje informativo
    vscode.window.showInformationMessage(
      "Vista del File Explorer abierta en el Sidebar Explorer."
    );
  }
);

export const openFile = vscode.commands.registerCommand(
  "odoo-debug.openFile",
  (resourceUri: vscode.Uri) => {
    vscode.workspace.openTextDocument(resourceUri).then((document) => {
      vscode.window.showTextDocument(document);
    });
  }
);
