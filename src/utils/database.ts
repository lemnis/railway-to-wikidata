import loki from "@lokidb/loki";
import { FSStorage } from "@lokidb/fs-storage";

const adapter = new FSStorage();
export const db = new loki(__dirname + "/../../.cache/locations.db", {
  env: "NODEJS",
  serializationMethod: "pretty",
});
// db.initializePersistence({
//   adapter,
//   autoload: true,
//   autosave: true,
//   autosaveInterval: 4000,
// });
