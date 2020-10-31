import { isCandidate } from './../middleware/isCandidate';
import { validateQuestions } from './../utils/validateQuestions';
import { QuestionsInput } from './inputs/QuestionsInput';
import { Company } from '../entity/Company';
import { Job } from '../entity/Job';
import { User } from '../entity/User';
import { isAuth } from '../middleware/isAuth';
import { isCompany } from '../middleware/isCompany';
import { FieldError } from '../types/FieldError';
import { MyContext } from '../types/MyContext';
import { validateJob } from '../utils/validateJob';
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { JobInput } from './inputs/JobInput';

@ObjectType()
class JobResponse {
  @Field(() => Job, { nullable: true })
  job?: Job;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class JobResolver {
  @UseMiddleware(isAuth)
  @Query(() => Job, { nullable: true })
  async job(@Arg('id', () => Int) id: number): Promise<Job | undefined> {
    return await Job.findOne(id, {
      relations: ['company', 'appliedCandidates'],
    });
  }

  @UseMiddleware(isAuth)
  @Query(() => [Job])
  async jobs(): Promise<Job[]> {
    return await Job.find({ relations: ['company'] });
  }

  @UseMiddleware(isCompany)
  @Mutation(() => JobResponse)
  async addJob(
    @Arg('input', () => JobInput) input: JobInput,
    @Ctx() { payload }: MyContext,
  ): Promise<JobResponse> {
    if (!payload?.userId) {
      return {
        errors: [{ field: 'userId', message: 'Invalid userId' }],
      };
    }

    const { title, description } = input;

    const errors = validateJob(input);
    if (errors) {
      return {
        errors,
      };
    }

    const user = await User.findOne(payload.userId);
    if (!user) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'Invalid User',
          },
        ],
      };
    }

    const company = await Company.findOne({ where: { admin: user } });

    if (!company) {
      return {
        errors: [
          { field: 'company', message: 'Please register a company first' },
        ],
      };
    }

    let job = await Job.create({
      title,
      description,
      company,
    }).save();

    return {
      job,
    };
  }

  @UseMiddleware(isCompany)
  @Mutation(() => JobResponse)
  async addQuestions(
    @Arg('input', () => QuestionsInput) input: QuestionsInput,
    @Ctx() { payload }: MyContext,
  ): Promise<JobResponse> {
    const user = await User.findOne(payload?.userId);
    if (!user) {
      throw new Error('No such user exists');
    }

    const { questions, jobId } = input;

    const job = await Job.findOne(jobId, { relations: ['company'] });

    if (!job) {
      return {
        errors: [
          {
            field: 'jobId',
            message: 'Invalid JobID',
          },
        ],
      };
    }

    if (job.company.admin.username !== user.username) {
      throw new Error(
        "Invalid Operation. You can't edit a job that doesn't belong to you",
      );
    }

    const errors = validateQuestions(input);

    if (errors) {
      return {
        errors,
      };
    }

    job.questions = job.questions.concat(questions);
    await job.save();
    return {
      job,
    };
  }
  @UseMiddleware(isCandidate)
  @Mutation(() => Boolean)
  async applyJob(
    @Arg('jobId', () => Int) id: number,
    @Ctx() { payload }: MyContext,
  ): Promise<Boolean> {
    const user = await User.findOne(payload?.userId);

    if (!user) {
      throw new Error('Invalid User');
    }

    const job = await Job.findOne(id, { relations: ['appliedCandidates'] });
    if (!job) {
      throw new Error('No such job exists');
    }

    try {
      job.appliedCandidates.push(user);
      await job.save();
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  @UseMiddleware(isCandidate)
  @Mutation(() => Boolean)
  async unapplyJob(
    @Arg('jobId', () => Int) id: number,
    @Ctx() { payload }: MyContext,
  ): Promise<Boolean> {
    const user = await User.findOne(payload?.userId);

    if (!user) {
      throw new Error('Invalid User');
    }

    const job = await Job.findOne(id, { relations: ['appliedCandidates'] });
    if (!job) {
      throw new Error('No such job exists');
    }

    try {
      job.appliedCandidates = job.appliedCandidates.filter((candidate) => {
        candidate.id !== user.id;
      });
      job.save();
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
