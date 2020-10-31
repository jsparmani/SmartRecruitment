import { getConnection } from 'typeorm';
import { isCandidate } from './../middleware/isCandidate';
import { Job } from './../entity/Job';
import { MyContext } from './../types/MyContext';
import { User } from './../entity/User';
import { isAdmin } from './../middleware/isAdmin';
import { compare, hash } from 'bcryptjs';
import { FieldError } from '../types/FieldError';
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
import { UserRole } from '../types/userTypes';
import { validateRegister } from '../utils/validateRegister';
import { createAccessToken, createRefreshToken } from './../utils/auth';
import { LoginInput } from './inputs/LoginInput';
import { RegisterInput } from './inputs/RegisterInput';

@ObjectType()
class AuthResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;
}

@Resolver()
export class UserResolver {
  @UseMiddleware(isAdmin)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find({ relations: ['profile'] });
  }

  @Mutation(() => AuthResponse)
  async register(
    @Arg('input', () => RegisterInput) input: RegisterInput,
  ): Promise<AuthResponse> {
    const { username, email, password, role } = input;

    const errors = validateRegister(input);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await hash(password, 12);

    let user;
    try {
      if (role) {
        user = await User.create({
          email,
          username,
          password: hashedPassword,
          role,
        }).save();
      } else {
        user = await User.create({
          username,
          email,
          password: hashedPassword,
          role: UserRole.CANDIDATE,
        }).save();
      }
    } catch (err) {
      if (err.code === '23505') {
        // Duplicate username or email
        return {
          errors: [
            {
              field: 'username/email',
              message: 'Username/Email has already been taken!',
            },
          ],
        };
      }
    }

    const accessToken = createAccessToken(user as User);
    const refreshToken = createRefreshToken(user as User);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Arg('input', () => LoginInput) input: LoginInput,
  ): Promise<AuthResponse> {
    const { usernameOrEmail, password } = input;
    const isEmail = usernameOrEmail.includes('@');

    let user;

    if (isEmail) {
      user = await User.findOne(
        { email: usernameOrEmail },
        {
          relations: ['profile'],
        },
      );
    } else {
      user = await User.findOne(
        { username: usernameOrEmail },
        {
          relations: ['profile'],
        },
      );
    }

    if (!user) {
      return {
        errors: [
          {
            field: isEmail ? 'email' : 'username',
            message: 'Does not exist',
          },
        ],
      };
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      return {
        errors: [{ field: 'password', message: 'Incorrect Password!' }],
      };
    }

    return {
      user,
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
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
