import {Gender} from "./../types/genderTypes";
import {Field, InputType, Int} from "type-graphql";

@InputType()
export class ProfileInput {
    @Field()
    name: string;

    @Field(() => Int)
    age: string;

    @Field(() => Gender)
    gender: Gender;

    @Field({nullable: true})
    photo?: string;
}
