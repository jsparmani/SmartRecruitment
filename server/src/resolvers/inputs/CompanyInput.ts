import { Field, InputType } from 'type-graphql';

@InputType()
export class CompanyInput {
  @Field()
  name: string;

  @Field()
  location: string;
}
