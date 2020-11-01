import { User } from './User';
import { Job } from './Job';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Response extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Job)
  @ManyToOne(() => Job, (job) => job.responses)
  job: Job;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.responses)
  user: User;

  @Field()
  @Column()
  question: string;

  @Field()
  @Column()
  answer: string;
}
