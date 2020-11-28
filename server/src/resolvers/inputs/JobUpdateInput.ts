import { Department } from './../../types/departmentTypes';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class JobUpdateInput {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Department)
  department: Department;

  @Field(() => [String])
  requirements: string[];
}
