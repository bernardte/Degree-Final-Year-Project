export const ROLE = {
    Admin: "admin",
    SuperAdmin: "superAdmin"
} as const;

//!It tells TypeScript to treat the values as literal types instead of general string.
//* Without as const, the values would be inferred as string.
//* With as const, TypeScript locks the values to "admin" and "superAdmin" specifically.

//? typeof: meaning give the type of ROLE
//? keyof typeof ROLE gives the keys of this object as a union of string literals:
export type Role = keyof typeof ROLE; //* "admin" | "superAdmin"
export type RoleValue = (typeof ROLE)[Role]//* "admin" | "superAdmin"

//! (typeof ROLE): give the type of the object
//! [Role]: give the type of the key of the object
//! (typeof ROLE)[Role] = (typeof ROLE)["admin" | "superAdmin"] === ROLE["Admin"] | ROLE["SuperAdmin"]
//* so the RoleValue will get the corresponding key of the ROLE.
