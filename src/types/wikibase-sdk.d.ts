declare module "wikibase-sdk" {
  type simplifyOptions = {
    // claims
    entityPrefix?: string;
    propertyPrefix?: string;
    keepRichValues?: boolean;
    keepQualifiers?: boolean;
    keepReferences?: boolean;
    keepIds?: boolean;
    keepHashes?: boolean;
    keepNonTruthy?: boolean; // For each property, keep claims with preferred rank, or normal rank if no claims has the preferred rank
    keepNonDeprecated?: boolean; // For each property, keep all claims with preferred or normal rank

    // sitelinks
    addUrl?: boolean;
  };

  export const simplify = {
    labels: (labels: any[], options?: simplifyOptions) => any,
    descriptions: (labels: any[], options?: simplifyOptions) => any,
    aliases: (labels: any[], options?: simplifyOptions) => any,
    claim: (labels: any[], options?: simplifyOptions) => any,
    propertyClaims: (labels: any[], options?: simplifyOptions) => any,
    claims: (labels: any[], options?: simplifyOptions) => any,
    qualifier: (labels: any[], options?: simplifyOptions) => any,
    propertyQualifiers: (labels: any[], options?: simplifyOptions) => any,
    qualifiers: (labels: any[], options?: simplifyOptions) => any,
    references: (labels: any[], options?: simplifyOptions) => any,
    sitelinks: (labels: any[], options?: simplifyOptions) => any,
    snak: (labels: any[], options?: simplifyOptions) => any,
    propertySnaks: (labels: any[], options?: simplifyOptions) => any,
    snaks: (labels: any[], options?: simplifyOptions) => any,
    lemmas: (labels: any[], options?: simplifyOptions) => any,
    glosses: (labels: any[], options?: simplifyOptions) => any,
    form: (labels: any[], options?: simplifyOptions) => any,
    forms: (labels: any[], options?: simplifyOptions) => any,
    sense: (labels: any[], options?: simplifyOptions) => any,
    senses: (labels: any[], options?: simplifyOptions) => any,
    sparqlResults: (labels: any[], options?: simplifyOptions) => any,
    entity: (labels: any[], options?: simplifyOptions) => any,
    entities: (labels: any[], options?: simplifyOptions) => any,
  };
  export const parse = {};
  export const isNumericId = (...args: any[]) => any;
  export const isEntityId = (...args: any[]) => any;
  export const isEntitySchemaId = (...args: any[]) => any;
  export const isItemId = (...args: any[]) => any;
  export const isPropertyId = (...args: any[]) => any;
  export const isLexemeId = (...args: any[]) => any;
  export const isFormId = (...args: any[]) => any;
  export const isSenseId = (...args: any[]) => any;
  export const isGuid = (...args: any[]) => any;
  export const isHash = (...args: any[]) => any;
  export const isPropertyClaimsId = (...args: any[]) => any;
  export const isRevisionId = (...args: any[]) => any;
  export const isEntityPageTitle = (...args: any[]) => any;
  export const getNumericId = (...args: any[]) => any;
  export const wikibaseTimeToDateObject = (...args: any[]) => any;
  export const wikibaseTimeToEpochTime = (...args: any[]) => any;
  export const wikibaseTimeToISOString = (...args: any[]) => any;
  export const wikibaseTimeToSimpleDay = (...args: any[]) => any;
  export const getImageUrl = (...args: any[]) => any;
  export const getEntityIdFromGuid = (...args: any[]) => any;
  export const getSitelinkUrl = (...args: any[]) => any;
  export const getSitelinkData = (...args: any[]) => any;
  export const isSitelinkKey = (...args: any[]) => any;
  export const truthyClaims = (...args: any[]) => any;
  export const truthyPropertyClaims = (...args: any[]) => any;
  export const nonDeprecatedPropertyClaims = (...args: any[]) => any;
}
