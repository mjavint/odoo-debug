import * as vscode from "vscode";
import { getOdooConfiguration } from "./utils";
import * as launch from "./constants";

const { pythonPath, odooBinPath, odooConfigPath, odooArgs } =
  getOdooConfiguration();

export const launchDebug: vscode.DebugConfiguration = {
  name: launch.DEBUG_ODOO,
  type: "python",
  request: "launch",
  stopOnEntry: false,
  console: "integratedTerminal",
  python: pythonPath,
  program: `${odooBinPath}/odoo-bin`,
  args: `-c ${odooConfigPath} ${odooArgs.join(" ")}`,
};

export const launchWithoutDebug: vscode.DebugConfiguration = {
  name: launch.DEBUG_ODOO,
  type: "python",
  request: "launch",
  stopOnEntry: false,
  console: "integratedTerminal",
  python: pythonPath,
  program: `${odooBinPath}/odoo-bin`,
  args: `-c ${odooConfigPath} ${odooArgs.join(" ")}`,
  noDebug: true,
};

export function launchChrome(mode: number) {
  const debugJSOdooConfiguration: vscode.DebugConfiguration = {
    name: launch.DEBUG_JS,
    type: "chrome",
    request: "launch",
    url: `http://localhost:8069/web/login?debug=${mode}`,
    webRoot: "${workspaceFolder}",
  };
  return debugJSOdooConfiguration;
}
