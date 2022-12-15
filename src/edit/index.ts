import { removeUri } from "../transform/simplify";
import { editLabel } from "./label";
import { editClaim } from "./claim";
import { score as Foo } from "../score";
import { Location } from "../types/location";
import { EntityEdit } from "../types/wikidata";

export const edit = (
  location: Location,
  // TODO: Create score interface
  score: ReturnType<typeof Foo>
): EntityEdit => ({
  // TODO: Remove explanation mark,
  // temporary added for easier to debug non wikidata items
  id: location.id! && removeUri(location.id),
  claims: editClaim(score.claims.matches, location),
  aliases: editLabel(score.labels.matches),
});
