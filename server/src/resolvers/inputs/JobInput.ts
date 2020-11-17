import { Department } from './../../types/departmentTypes';
import { Field, InputType } from 'type-graphql';

@InputType()
export class JobInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Department)
  department: Department;

  @Field(() => [String])
  requirements: string[];
}
