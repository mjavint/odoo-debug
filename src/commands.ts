import * as vscode from "vscode";
import {
  launchDebug,
  launchWithoutDebug,
  launchChrome,
} from "./launchConfiguration";
import * as launch from "./constants";
import { getOdooConfiguration } from "./utils";

const { pythonPath, odooBinPath, odooConfigPath, odooArgs } =
  getOdooConfiguration();

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
    // Opens a dialog box to select a file
    const fileUri = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: "Seleccionar archivo",
    });

    if (fileUri && fileUri.length > 0) {
      // Gets the path of the selected file as a string
      const filePath = fileUri[0].fsPath;
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
