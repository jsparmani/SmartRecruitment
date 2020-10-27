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
class AuthResponse {
    @Field(() => User, {nullable: true})
    user?: User;

    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

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

    @Mutation(() => AuthResponse)
    async register(
        @Arg("input", () => RegisterInput) input: RegisterInput
    ): Promise<AuthResponse> {
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
        @Arg("input", () => LoginInput) input: LoginInput
    ): Promise<AuthResponse> {
        const {usernameOrEmail, password} = input;
        const isEmail = usernameOrEmail.includes("@");

        let user;

        if (isEmail) {
            user = await User.findOne(
                {email: usernameOrEmail},
                {
                    relations: ["profile"],
                }
            );
        } else {
            user = await User.findOne(
                {username: usernameOrEmail},
                {
                    relations: ["profile"],
                }
            );
        }

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
