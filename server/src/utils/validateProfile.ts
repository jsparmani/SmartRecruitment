import { isBase64 } from 'class-validator';
import { ProfileInput } from './../resolvers/inputs/ProfileInput';

export const validateProfile = (options: ProfileInput) => {
  const { name, photo, gender, age } = options;

  if (!name) {
    return [{ field: 'name', message: 'Name cannot be empty' }];
  }

  if (!gender) {
    return [{ field: 'gender', message: 'gender cannot be empty' }];
  }

  if (parseInt(age) <= 0 || isNaN(parseInt(age))) {
    return [{ field: 'age', message: 'Please provide a valid number' }];
  }

  if (photo && !isBase64(photo)) {
    return [
      { field: 'photo', message: 'Please provide a valid base64 string' },
    ];
  }

  return null;
};
