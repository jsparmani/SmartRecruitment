import { UserRole } from "../types/userTypes";
import { Int, ObjectType, Field } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn} from "typeorm";
import { Profile } from "./Profile";

@ObjectType()
@Entity("users")
export class User extends BaseEntity{

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;

    @Field(() => UserRole)
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CANDIDATE
    })
    role: UserRole

    @Column()
    password: string;

    @Field(() => Profile)
    @OneToOne(_ => Profile)
    @JoinColumn()
    profile: Profile;

    @Column("int", {default: 0})
    tokenVersion: number;

}