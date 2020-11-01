import { User } from './User';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from './Job';

@ObjectType()
@Entity()
export class Company extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  location: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  admin: User;

  @Field(() => [Job], { nullable: true })
  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}
