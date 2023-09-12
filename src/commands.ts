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
import { getOdooConfiguration } from "./utils";

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
    // Registra un observador para cambios en las configuraciones de usuario y espacio de trabajo
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("odoo-debug.odooConf")) {
        // La configuración 'odoo-debug.odooConf' ha cambiado
        vscode.window.showInformationMessage(
          "La configuración odoo-debug.odooConf ha cambiado."
        );

        // Realiza las acciones que necesites en respuesta al cambio
        // Por ejemplo, puedes actualizar alguna funcionalidad de tu extensión
        odooConfigPath = vscode.workspace
          .getConfiguration("odoo-debug")
          .get("odooConf", "");
      }
    });
    const fileConf = vscode.Uri.file(odooConfigPath);
    let fileUri: vscode.Uri[] | undefined;
    if (fileConf.fsPath !== "/" || (fileUri && fileUri.length > 0)) {
      vscode.window.showTextDocument(fileConf);
    } else {
      // Opens a dialog box to select a file
      fileUri = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        openLabel: "Select a odoo",
      });
      // Gets the path of the selected file as a string
      const filePath: string | undefined = fileUri![0].fsPath;
      // Use the Configuration API to save custom settings to the user configuration file
      await vscode.workspace
        .getConfiguration()
        .update(
          "odoo-debug.odooConf",
          filePath,
          vscode.ConfigurationTarget.Workspace
        );

      // Show the file path in a message
      vscode.window.showInformationMessage(
        `Ruta del archivo seleccionado: ${filePath}`
      );
    }
  }
);

export const debugJS = openChrome("odoo-debug.debugJS", launch.MODE_DEBUG_JS);
export const debugOdoo = openChrome("odoo-debug.debugOdoo", launch.MODE_DEBUG);

export const openExplorer = vscode.commands.registerCommand(
  "odoo-debug.openExplorer",
  async () => {
    // Ruta de la carpeta de Odoo configurada por el usuario
    const odooPath = vscode.workspace
      .getConfiguration()
      .get<string>("odoo-debug.odooBinPath");

    if (!odooPath) {
      vscode.window.showErrorMessage("La ruta de Odoo no está configurada.");
      return;
    }

    // Crea un TreeDataProvider para mostrar la lista de archivos y subdirectorios
    const fileExplorerProvider = new FileExplorerProvider(`${odooPath}/addons`);

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
