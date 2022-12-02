import { db, dbIsLoaded } from "../../utils/database";

export const refreshDatabase = async () => {
  await dbIsLoaded;
  
  // const collection = db.getCollection(Property.LocatedInTimeZone);
  // collection.clear();
  // await cacheWikidataTimeZones();
  
  db.saveDatabase();
  db.close();
};
