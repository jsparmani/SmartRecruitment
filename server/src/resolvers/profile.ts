import { validateProfile } from './../utils/validateProfile';
import { ProfileInput } from './inputs/ProfileInput';
import { Profile } from './../entity/Profile';
import { MyContext } from './../types/MyContext';
import { User } from './../entity/User';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  ObjectType,
} from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';
import { FieldError } from '../types/FieldError';

@ObjectType()
class ProfileResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}

@Resolver()
export class ProfileResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() { payload }: MyContext): Promise<User | undefined> {
    if (!payload?.userId) {
      throw new Error('Invalid User');
    }

    let user = await User.findOne(parseInt(payload.userId), {
      relations: ['profile'],
    });
    if (!user) {
      throw new Error('User does not exist!');
    }

    return user;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => ProfileResponse, { nullable: true })
  async createOrUpdateProfile(
    @Ctx() { payload }: MyContext,
    @Arg('input', () => ProfileInput) input: ProfileInput,
  ): Promise<ProfileResponse> {
    if (!payload?.userId) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'Missing',
          },
        ],
      };
    }

    const user = await User.findOne(parseInt(payload.userId), {
      relations: ['profile'],
    });

    const { name, age, photo, gender } = input;

    if (!user) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'Does not exist!',
          },
        ],
      };
    }

    const errors = validateProfile(input);
    if (errors) {
      return {
        errors,
      };
    }

    if (user.profile) {
      let profile = user.profile;
      profile.name = name;
      profile.age = age;
      profile.gender = gender;
      if (photo) {
        profile.photo = photo;
      }
      return {
        profile: await profile.save(),
      };
    }

    const profile = await Profile.create({ ...input }).save();
    user.profile = profile;
    await getConnection().manager.save(user);
    return { profile };
  }
}
