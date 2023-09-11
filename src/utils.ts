import * as vscode from "vscode";

export function getOdooConfiguration() {
  const config = vscode.workspace.getConfiguration(
    "python",
    vscode.window.activeTextEditor?.document.uri
  );
  const configOdoo = vscode.workspace.getConfiguration("odoo-debug");

  // Get the Python interpreter from the context
  const pythonPath = config.get<string>("pythonPath");
  const odooBinPath = configOdoo.get("odooBinPath", "");
  const odooConfigPath = configOdoo.get("odooConf", "");
  const odooArgs: string[] = configOdoo.get("odooArgs", []);

  return { pythonPath, odooBinPath, odooConfigPath, odooArgs };
}
