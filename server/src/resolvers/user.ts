import {hash} from "bcryptjs";
import {validateRegister} from "../utils/validateRegister";
import {Arg, Field, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import {User} from "../entity/User";
import {RegisterInput} from "./RegisterInput";
import {UserRole} from "../types/userTypes";

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
                    password,
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
}
