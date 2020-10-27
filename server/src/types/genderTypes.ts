import {registerEnumType} from "type-graphql";
export enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHERS = "others",
}

registerEnumType(Gender, {
    name: "Gender",
});
