import { RegisterInput } from 'src/resolvers/inputs/RegisterInput';

export const validateRegister = (options: RegisterInput) => {
  const { email, username, password } = options;
  if (!email.includes('@')) {
    return [{ field: 'email', message: 'Invalid Email' }];
  }

  if (username.length <= 4) {
    return [
      {
        field: 'username',
        message: 'Length must be greater than 4',
      },
    ];
  }

  if (username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'Cannot have @ symbol',
      },
    ];
  }

  if (password.length <= 6) {
    return [
      {
        field: 'password',
        message: 'Length must be greater than 6',
      },
    ];
  }

  return null;
};
