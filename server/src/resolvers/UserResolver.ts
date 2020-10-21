import { hash } from "bcryptjs";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import {User} from "../entity/User";

@Resolver()
export class UserResolver {
    
    @Query(() => String)
    hello() {
        return 'hi!';
    }

    @Mutation(() => Boolean) 
    async register(
        @Arg('email', () => String) email:string,
        @Arg('password', () => String) password: string,
        
    ) {
        const hashedPassword = await hash(password, 12);
        
        try {
            await User.insert({
                email: email, 
                password: hashedPassword,
            });
        } catch(err) {
            console.log(err);
            return false
        }

        return true;
    }
}