import { JobInput } from './../resolvers/inputs/JobInput';

export const validateJob = (options: JobInput) => {
  const { title, description, requirements, department } = options;

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

  if (!department) {
    return [
      {
        field: 'department',
        message: 'Department cannot be empty',
      },
    ];
  }

  //FIXME: Below validations don't work properly

  requirements.forEach((req): any => {
    if (req === '') {
      return [
        {
          field: 'requirements',
          message: 'Requirements cannot be empty',
        },
      ];
    }

    if (req.includes(',')) {
      return [
        {
          field: 'requirements',
          message: 'Requirements cannot have a , in between',
        },
      ];
    }
  });

  return null;
};
