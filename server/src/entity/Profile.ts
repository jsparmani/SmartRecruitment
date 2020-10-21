import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {ObjectType, Int, Field} from "type-graphql"
import { Gender } from "../types/genderTypes";

@ObjectType()
@Entity("profile")
export class Profile extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field(() => Date)
    @Column()
    dob: Date;

    @Field(() => Gender)
    @Column({
        type: "enum",
        enum: Gender,
    })
    gender: Gender

    @Field()
    @Column()
    photo: string;
}