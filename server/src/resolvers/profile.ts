import { ProfileInput } from './inputs/ProfileInput';
import { Profile } from './../entity/Profile';
import { MyContext } from './../types/MyContext';
import { User } from './../entity/User';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';

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
  @Mutation(() => Profile, { nullable: true })
  async createOrUpdateProfile(
    @Ctx() { payload }: MyContext,
    @Arg('input', () => ProfileInput) input: ProfileInput,
  ): Promise<Profile | undefined> {
    if (!payload?.userId) {
      throw new Error('Invalid User');
    }

    const user = await User.findOne(parseInt(payload.userId), {
      relations: ['profile'],
    });

    const { name, age, photo, gender } = input;

    if (!user) {
      throw new Error('User does not exist'!);
    }

    if (user.profile) {
      let profile = user.profile;
      profile.name = name;
      profile.age = age;
      profile.gender = gender;
      if (photo) {
        profile.photo = photo;
      }
      return await profile.save();
    }

    const profile = await Profile.create({ ...input }).save();
    user.profile = profile;
    await getConnection().manager.save(user);
    return profile;
  }
}
