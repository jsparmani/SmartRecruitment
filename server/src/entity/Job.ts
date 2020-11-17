import { Department } from './../types/departmentTypes';
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
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Response } from './Response';

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

  @Field(() => [String])
  @Column('simple-array', { default: '' })
  requirements: string[];

  @Field(() => Company)
  @ManyToOne(() => Company, (company) => company.jobs)
  company: Company;

  @Field(() => Department)
  @Column({
    type: 'enum',
    enum: Department,
    default: Department.OTHERS,
  })
  department: Department;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.appliedJobs)
  @JoinTable()
  appliedCandidates: User[];

  @Field(() => [String])
  @Column('simple-array', { default: '' })
  questions: string[];

  @Field(() => [Response])
  @OneToMany(() => Response, (response) => response.job)
  responses: Response[];
}
