import * as vscode from "vscode";
import { launchChrome } from "./launchConfiguration";
import * as launch from "./constants";

export const debugJS = vscode.commands.registerCommand(
  "odoo-debug.debugJS",
  async () => {
    try {
      // Ejecuta el comando personalizado con la configuración
      await vscode.debug.startDebugging(
        undefined,
        launchChrome(launch.MODE_DEBUG_JS)
      );

      // Puedes mostrar un mensaje para indicar que se ejecutó la configuración personalizada
      vscode.window.showInformationMessage("Se ejecutó el debug JS de Odoo.");
    } catch (error) {
      // Manejo de errores si la ejecución falla por alguna razón
      vscode.window.showErrorMessage(
        "No se pudo ejecutar la configuración personalizada de Odoo. Verifica la configuración y los comandos disponibles."
      );
    }
  }
);
