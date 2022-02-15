import loki from "@lokidb/loki";
import { FSStorage } from "@lokidb/fs-storage";
import { Property } from "../types/wikidata";
import { uniqWith } from "lodash";

const adapter = new FSStorage();

export const db = new loki("locations.db.json", {
  env: "NODEJS",
  serializationMethod: "pretty",
});

export const dbIsLoaded = db.initializePersistence({
  adapter,
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
});

const removeDuplicates = async () => {
  await dbIsLoaded;
  const coll = db.getCollection<{ id: string; coordinates: any[], name: string }>(
    Property.InAdministrativeTerritory
  );

  coll
    .chain()
    .data()
    .forEach((each) => {
      const items = coll.find({ id: each.id, name: each.name });
      if (items.length <= 1) return;
      items.forEach((item, i) => {
        if (i === 0) return;
        coll.update({
          ...items[0],
          coordinates: uniqWith([...items[0].coordinates, ...item.coordinates]),
        });
        coll.remove(item.$loki);
      });
    });
};
