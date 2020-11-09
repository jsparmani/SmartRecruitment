import { Field, InputType } from 'type-graphql';

@InputType()
export class JobInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [String])
  requirements: string[];
}
