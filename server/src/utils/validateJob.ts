import { JobInput } from './../resolvers/inputs/JobInput';

export const validateJob = (options: JobInput) => {
  const { title, description } = options;

  if (!title) {
    return [{ field: 'title', message: 'Title cannot be empty' }];
  }

  if (!description) {
    return [
      {
        field: 'description',
        message: 'Description cannot be empty',
      },
    ];
  }

  return null;
};
