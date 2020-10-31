import { User } from './User';
import { Company } from './Company';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Job extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Company)
  @ManyToOne(() => Company, (company) => company.jobs)
  company: Company;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.appliedJobs)
  @JoinTable()
  appliedCandidates: User[];

  @Field(() => [String])
  @Column('simple-array', { default: '' })
  questions: string[];
}
