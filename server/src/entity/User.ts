import { Job } from './Job';
import { Profile } from './Profile';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../types/userTypes';
import { Response } from './Response';

@ObjectType()
@Entity({ name: 'myusers' })
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CANDIDATE,
  })
  role: UserRole;

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, { nullable: true })
  @JoinColumn()
  profile: Profile;

  @Field(() => [Job], { nullable: true })
  @ManyToMany(() => Job, (job) => job.appliedCandidates)
  appliedJobs: Job[];

  @Field(() => [Response], { nullable: true })
  @OneToMany(() => Response, (response) => response.user)
  responses: Response[];

  @Column()
  password: string;

  @Column('int', { default: 0 })
  tokenVersion: number;
}
