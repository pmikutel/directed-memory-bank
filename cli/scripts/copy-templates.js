import { cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pairs = [
  {
    source: resolve(__dirname, "../../template/memory-bank"),
    target: resolve(__dirname, "../templates/memory-bank"),
  },
  {
    source: resolve(__dirname, "../../template/integrations"),
    target: resolve(__dirname, "../templates/integrations"),
  },
];

for (const { source, target } of pairs) {
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true });
  console.log(`templates copied: ${source} -> ${target}`);
}
