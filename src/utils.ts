import * as vscode from "vscode";
import * as path from "path";

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

export function getIconFileName(fileName: string): string {
  const fileExtension = path.extname(fileName).toLowerCase();
  switch (fileExtension) {
    case ".py":
      return "odoo.svg";
    case ".xml":
      return "csv.png";
    case ".csv":
      return "csv.svg";
    default:
      return "odoo_icon.svg"; // Un ícono predeterminado para otras extensiones
  }
}
