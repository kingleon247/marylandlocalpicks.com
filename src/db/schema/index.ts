/**
 * Phase 1 schema barrel. drizzle.config.ts and the db client both import from
 * here. Splitting by domain keeps each file focused; this re-exports the whole
 * Phase 1 surface (enums, tables, relations, inferred types).
 */
export * from "./enums";
export * from "./reference";
export * from "./businesses";
export * from "./editions";
export * from "./reservations";
export * from "./activity";
export * from "./relations";
