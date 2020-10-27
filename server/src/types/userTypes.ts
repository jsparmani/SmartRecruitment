import {registerEnumType} from "type-graphql";
export enum UserRole {
    ADMIN = "admin",
    CANDIDATE = "candidate",
    COMPANY = "company",
}

registerEnumType(UserRole, {
    name: "UserRole",
    description: "Different user roles",
});
