import {Field, Int, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserRole} from "../types/userTypes";

@ObjectType()
@Entity({name: "myusers"})
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique: true})
    email: string;

    @Field()
    @Column({unique: true})
    username: string;

    @Field(() => UserRole)
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CANDIDATE,
    })
    role: UserRole;

    @Column()
    password: string;

    @Column("int", {default: 0})
    tokenVersion: number;
}
