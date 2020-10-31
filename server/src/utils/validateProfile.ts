import { ProfileInput } from './../resolvers/inputs/ProfileInput';

export const validateProfile = (options: ProfileInput) => {
  const { name, gender, age } = options;

  if (!name) {
    return [{ field: 'name', message: 'Name cannot be empty' }];
  }

  if (!gender) {
    return [{ field: 'gender', message: 'gender cannot be empty' }];
  }

  if (parseInt(age) <= 0 || isNaN(parseInt(age))) {
    return [{ field: 'age', message: 'Please provide a valid number' }];
  }

  return null;
};
