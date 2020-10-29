import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/MyContext';
import { verify } from 'jsonwebtoken';

export const isAdmin: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error('Not authenticated');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    if ((payload as any).role !== 'admin') {
      throw new Error('Not a admin user');
    }
    context.payload = payload as any;
  } catch (err) {
    console.log('Error', err);
    throw new Error(err);
  }
  return next();
};
