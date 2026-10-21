/**
 * Public surface of the government data layer. Views import from here (or from the individual
 * modules) and never from `govEntities.ts`, `govEntityDetails.ts` or `govSectors.ts`.
 */
export * from './types.ts'
export * from './taxonomy.ts'
export * from './plural.ts'
export * from './loaders.ts'
export * from './useGovData.ts'
