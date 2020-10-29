import { User } from './../entity/User';
import { MyContext } from './../types/MyContext';
import { isAuth } from './../middleware/isAuth';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
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

@Resolver()
export class CompanyResolver {
  @UseMiddleware(isAuth)
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
}
