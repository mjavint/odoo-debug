import * as vscode from "vscode";
import * as cmd from "./commands";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Extensión activada");

  // Add a separator button before the first button
  const initSeparator = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  // Set the separator text
  initSeparator.text = "|";
  initSeparator.show();

  // Create the "Close Process" button in the status bar
  const openFileExplorerButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  openFileExplorerButton.text = "$(gear)";
  openFileExplorerButton.tooltip = "Reiniciar servidor de Odoo";
  openFileExplorerButton.command = "odoo-debug.openFileExplorer";
  openFileExplorerButton.show();

  // Command to run the JS debug of the Odoo server
  const debugJSButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  debugJSButton.text = "$(debug)";
  debugJSButton.tooltip = "Ejecutar el servidor de Odoo en modo debug JS";
  debugJSButton.command = "odoo-debug.debugJS";
  debugJSButton.show();

  // Command to run debug of the Odoo server
  const debugOdoo = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  debugOdoo.text = "$(code)";
  debugOdoo.tooltip = "Ejecutar el servidor de Odoo en modo desarrollador";
  debugOdoo.command = "odoo-debug.debugOdoo";
  debugOdoo.show();

  // Command to run the Odoo server debug
  const debugServerButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  debugServerButton.text = "$(debug-alt)";
  debugServerButton.tooltip = "Ejecutar el servidor de Odoo en modo debug";
  debugServerButton.command = "odoo-debug.debugServer";
  debugServerButton.show();

  // Create the "Close Process" button in the status bar
  const startServerButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  startServerButton.text = "$(run-all)";
  startServerButton.tooltip = "Ejecutar el servidor de Odoo";
  startServerButton.command = "odoo-debug.startServer";
  startServerButton.show();

  // Add a separator button after the last button
  const finalSeparator = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  // Set the separator text
  finalSeparator.text = "|";
  finalSeparator.show();

  // Subscribe el comando runOdooCommand
  context.subscriptions.push(
    initSeparator,
    finalSeparator,
    cmd.openFileExplorer,
    cmd.debugServer,
    cmd.debugJS,
    cmd.debugOdoo,
    cmd.startServer
  );
}

export function deactivate() {
  // This method will be called when your extension is disabled
}
