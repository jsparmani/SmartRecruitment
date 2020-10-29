import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FieldError {
  @Field()
  message: string;

  @Field()
  field: string;
}
