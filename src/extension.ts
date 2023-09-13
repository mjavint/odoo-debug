import * as vscode from "vscode";
import * as cmd from "./commands";
import { getOdooConfiguration } from "./utils";
import * as p from "./providers";
import { FileExplorerProvider } from "./providers";

let { odooBinPath } = getOdooConfiguration();

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Odoo Debug Activated");

  // Add a separator button before the first button
  const initSeparator = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  // Set the separator text
  initSeparator.text = "|";
  initSeparator.show();

  // Choice configuration file Odoo
  const openFileExplorerButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  openFileExplorerButton.text = "$(gear)";
  openFileExplorerButton.tooltip = "Choice configuration file Odoo";
  openFileExplorerButton.command = "odoo-debug.openFileExplorer";
  openFileExplorerButton.show();

  // Command to Run the browser in JS debug mode and assets
  const debugJSButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  debugJSButton.text = "$(debug)";
  debugJSButton.tooltip = "Run the browser in JS debug mode and assets";
  debugJSButton.command = "odoo-debug.debugJS";
  debugJSButton.show();

  // Command to Run the browser in debug mode
  const debugOdoo = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  debugOdoo.text = "$(code)";
  debugOdoo.tooltip = "Run the browser in debug mode";
  debugOdoo.command = "odoo-debug.debugOdoo";
  debugOdoo.show();

  // Command to run the Odoo server debug
  const debugServerButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  debugServerButton.text = "$(debug-alt)";
  debugServerButton.tooltip = "Run the Odoo server in debug mode";
  debugServerButton.command = "odoo-debug.debugServer";
  debugServerButton.show();

  // Command to Run the Odoo server without the debug
  const startServerButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  startServerButton.text = "$(run-all)";
  startServerButton.tooltip = "Run the Odoo server without the debug";
  startServerButton.command = "odoo-debug.startServer";
  startServerButton.show();

  // Command to Run the Odoo server without the debug
  const openOdoo = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  openOdoo.text = "$(folder-opened)";
  openOdoo.tooltip = "Open Odoo folder";
  openOdoo.command = "odoo-debug.openExplorer";
  openOdoo.show();

  // Add a separator button after the last button
  const finalSeparator = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  // Set the separator text
  finalSeparator.text = "|";
  finalSeparator.show();

  // Crea un TreeDataProvider para mostrar la lista de archivos y subdirectorios
  // const fileExplorerProvider = new FileExplorerProvider(
  //   [`${odooBinPath}/addons`]
  // );
  // const rootPath = [`${odooBinPath}/adddons`, `${odooBinPath}/odoo/adddons`];
  // const fileExplorerProvider = new FileExplorerProvider(rootPath);

  // Registra el TreeDataProvider en la vista del Sidebar Explorer
  // const fileExplorer = vscode.window.registerTreeDataProvider(
  //   "odoo-debug.fileExplorer",
  //   fileExplorerProvider
  // );

  // Commands General Subscribe
  context.subscriptions.push(
    initSeparator,
    finalSeparator,
    cmd.debugServer,
    cmd.debugJS,
    cmd.debugOdoo,
    cmd.startServer,
    cmd.openFileExplorer,
    cmd.openExplorer,
    // fileExplorer,
    cmd.openFile
  );
}

export function deactivate() {}
