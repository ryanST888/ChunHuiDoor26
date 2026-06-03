import { cp, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsRoot = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptsRoot);
const publicRoot = join(projectRoot, "public");

const assetDirectories = [
  "chanpinzhanshi",
  "guanyuwomen",
  "lianxiwomen",
  "xinwendongtai",
  "ziyuan",
  "consequence",
];

const staticFiles = ["data.js", "product-upload.html", "product-preview.html"];

await mkdir(publicRoot, { recursive: true });

await Promise.all(
  assetDirectories
    .filter(name => existsSync(join(projectRoot, name)))
    .map(name =>
      cp(join(projectRoot, name), join(publicRoot, name), {
        recursive: true,
        force: true,
      }),
    ),
);

await Promise.all(
  staticFiles
    .filter(name => existsSync(join(projectRoot, name)))
    .map(name => copyFile(join(projectRoot, name), join(publicRoot, name))),
);
