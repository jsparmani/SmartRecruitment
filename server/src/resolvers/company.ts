import { validateCompany } from './../utils/validateCompany';
import { CompanyInput } from './inputs/CompanyInput';
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
import { User } from './../entity/User';
import { isAuth } from './../middleware/isAuth';
import { isCompany } from './../middleware/isCompany';
import { FieldError } from './../types/FieldError';
import { MyContext } from './../types/MyContext';

@ObjectType()
class CompanyResponse {
  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class CompanyResolver {
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
    @Arg('input', () => CompanyInput) input: CompanyInput,
    @Ctx() { payload }: MyContext,
  ): Promise<CompanyResponse> {
    if (!payload?.userId) {
      return {
        errors: [{ field: 'userId', message: 'Invalid userId' }],
      };
    }

    const { name, location } = input;

    const errors = validateCompany(input);

    if (errors) {
      return {
        errors,
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
        location: location,
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
}
