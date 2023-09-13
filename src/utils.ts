import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

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

// Función para obtener la nueva configuración (puede ser a través de un cuadro de diálogo, por ejemplo)
export async function getNewOdooConfigPath(): Promise<string | undefined> {
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    openLabel: "Select a odoo",
  });

  if (fileUri && fileUri.length > 0) {
    // Obtén el path del archivo seleccionado
    return fileUri[0].fsPath;
  }

  return undefined;
}

export function buscarCarpetasAddonsEnRuta(ruta: string): string[] {
  let carpetasAddons: string[] = [];

  // Lee el contenido del directorio
  const archivos = fs.readdirSync(ruta);

  // Itera sobre los archivos y carpetas
  archivos.forEach((archivo) => {
    const archivoRuta = path.join(ruta, archivo);

    // Verifica si es un directorio
    if (fs.statSync(archivoRuta).isDirectory()) {
      // Si el directorio se llama "addons", agrégalo a la lista
      if (archivo === "addons") {
        carpetasAddons.push(archivoRuta);
      } else {
        // Si no, realiza una búsqueda recursiva en ese directorio
        carpetasAddons = carpetasAddons.concat(
          buscarCarpetasAddonsEnRuta(archivoRuta)
        );
      }
    }
  });

  return carpetasAddons;
}

// Función para buscar carpetas "addons" en una lista de rutas
export function buscarCarpetasAddonsEnLista(rutas: string[]): string[] {
  let todasLasCarpetasAddons: string[] = [];

  rutas.forEach((ruta) => {
    const carpetasAddonsEnRuta = buscarCarpetasAddonsEnRuta(ruta);
    todasLasCarpetasAddons =
      todasLasCarpetasAddons.concat(carpetasAddonsEnRuta);
  });

  return todasLasCarpetasAddons;
}
