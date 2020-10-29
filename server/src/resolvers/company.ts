import { isAuth } from './../middleware/isAuth';
import { validateJob } from './../utils/validateJob';
import { Job } from './../entity/Job';
import { JobInput } from './inputs/JobInput';
import { isCompany } from './../middleware/isCompany';
import { User } from './../entity/User';
import { MyContext } from './../types/MyContext';
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
import { Company } from './../entity/Company';
import { FieldError } from './../types/FieldError';

@ObjectType()
class CompanyResponse {
  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
class JobResponse {
  @Field(() => Job, { nullable: true })
  job?: Job;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class CompanyResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Job])
  async jobs(): Promise<Job[]> {
    return await Job.find({ relations: ['company'] });
  }

  @UseMiddleware(isAuth)
  @Query(() => Job, { nullable: true })
  async job(@Arg('id', () => Int) id: number): Promise<Job | undefined> {
    return await Job.findOne(id, {
      relations: ['company', 'appliedCandidates'],
    });
  }

  @UseMiddleware(isAuth)
  @Query(() => [Company])
  async companies() {
    return await Company.find({ relations: ['admin'] });
  }

  @UseMiddleware(isAuth)
  @Query(() => Company, { nullable: true })
  async company(
    @Arg('id', () => Int) id: number,
  ): Promise<Company | undefined> {
    return await Company.findOne(id, { relations: ['jobs', 'admin'] });
  }

  @UseMiddleware(isCompany)
  @Mutation(() => CompanyResponse, { nullable: true })
  async registerCompany(
    @Arg('name') name: string,
    @Ctx() { payload }: MyContext,
  ): Promise<CompanyResponse> {
    if (!payload?.userId) {
      return {
        errors: [{ field: 'userId', message: 'Invalid userId' }],
      };
    }
    if (!name) {
      return {
        errors: [{ field: 'name', message: 'cannot be empty' }],
      };
    }

    const user = await User.findOne(payload.userId, { relations: ['profile'] });
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

    let company;

    try {
      company = await Company.create({
        name: name,
        admin: user,
      }).save();
    } catch (err) {
      if (err.code === '23505') {
        // Duplicate username or email
        return {
          errors: [
            {
              field: 'company',
              message: 'You cannot register more than one company',
            },
          ],
        };
      }
    }

    return {
      company,
    };
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
}
