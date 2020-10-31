import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class QuestionsInput {
  @Field(() => Int)
  jobId: number;

  @Field(() => [String])
  questions: string[];
}
