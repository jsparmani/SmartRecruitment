import {UserRole} from "../types/userTypes";
import {Field, InputType} from "type-graphql";

@InputType()
export class RegisterInput {
    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field(() => UserRole, {nullable: true})
    role?: UserRole;
}
