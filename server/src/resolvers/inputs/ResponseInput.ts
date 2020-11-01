import { Field, InputType } from 'type-graphql';

@InputType()
export class ResponseInput {
  @Field()
  jobId: number;

  @Field()
  question: string;

  @Field()
  answer: string;
}
