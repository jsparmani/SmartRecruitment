import { Response } from './../entity/Response';
import { Job } from './../entity/Job';
import { validateResponse } from './../utils/validateResponse';
import { FieldError } from './../types/FieldError';
import { User } from './../entity/User';
import { MyContext } from './../types/MyContext';
import { ResponseInput } from './inputs/ResponseInput';
import { isCandidate } from './../middleware/isCandidate';
import {
  Arg,
  Ctx,
  Mutation,
  Resolver,
  UseMiddleware,
  ObjectType,
  Field,
} from 'type-graphql';

@ObjectType()
class ResponseResponse {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class ResponseResolver {
  @UseMiddleware(isCandidate)
  @Mutation(() => ResponseResponse)
  async registerResponse(
    @Arg('input', () => ResponseInput) input: ResponseInput,
    @Ctx() { payload }: MyContext,
  ): Promise<ResponseResponse> {
    const user = await User.findOne(payload?.userId);
    if (!user) {
      return {
        ok: false,
        errors: [
          {
            field: 'userId',
            message: 'Invalid User Id',
          },
        ],
      };
    }
    const { jobId, question, answer } = input;
    const job = await Job.findOne(jobId);
    // TODO: Check if the candidate has applied to the job or not else reject
    if (!job) {
      return {
        ok: false,
        errors: [{ field: 'jobId', message: 'Invalid jobId' }],
      };
    }

    const errors = validateResponse(input);
    if (errors) {
      return {
        ok: false,
        errors,
      };
    }

    await Response.create({
      question,
      answer,
      user,
      job,
    }).save();

    return {
      ok: true,
    };
  }
}
