import {compare, hash} from "bcryptjs";
import {Arg, Field, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import {User} from "../entity/User";
import {UserRole} from "../types/userTypes";
import {validateRegister} from "../utils/validateRegister";
import {createAccessToken, createRefreshToken} from "./../utils/auth";
import {LoginInput} from "./LoginInput";
import {RegisterInput} from "./RegisterInput";

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@ObjectType()
class LoginResponse {
    @Field(() => User, {nullable: true})
    user?: User;

    @Field(() => [FieldError], {nullable: true})
    error?: FieldError[];

    @Field({nullable: true})
    accessToken?: string;

    @Field({nullable: true})
    refreshToken?: string;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello(): String {
        return "hi";
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("input", () => RegisterInput) input: RegisterInput
    ): Promise<UserResponse> {
        const {username, email, password, role} = input;

        const errors = validateRegister(input);

        if (errors) {
            return {errors};
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
            if (err.code === "23505") {
                // Duplicate username error
                return {
                    errors: [
                        {
                            field: "username/email",
                            message: "Username/Email has already been taken!",
                        },
                    ],
                };
            }
        }

        return {
            user,
        };
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("input", () => LoginInput) input: LoginInput
    ): Promise<LoginResponse> {
        const {usernameOrEmail, password} = input;
        const isEmail = usernameOrEmail.includes("@");

        const user = await User.findOne(
            isEmail
                ? {where: {email: usernameOrEmail}}
                : {where: {username: usernameOrEmail}}
        );

        if (!user) {
            return {
                error: [
                    {
                        field: isEmail ? "email" : "username",
                        message: "Does not exist",
                    },
                ],
            };
        }

        const valid = await compare(password, user.password);

        if (!valid) {
            return {
                error: [{field: "password", message: "Incorrect Password!"}],
            };
        }

        return {
            user,
            accessToken: createAccessToken(user),
            refreshToken: createRefreshToken(user),
        };
    }
}
