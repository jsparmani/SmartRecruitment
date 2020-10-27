import {Field, Int, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Gender} from "./../types/genderTypes";

@ObjectType()
@Entity()
export class Profile extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field(() => Int)
    @Column("int")
    age: string;

    @Field(() => Gender)
    @Column({
        type: "enum",
        enum: Gender,
    })
    role: Gender;

    @Field({nullable: true})
    @Column("bytea", {nullable: true})
    photo: string;
}
