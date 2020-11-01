import { ResponseInput } from './../resolvers/inputs/ResponseInput';

export const validateResponse = (options: ResponseInput) => {
  const { jobId, question, answer } = options;

  if (!jobId) {
    return [{ field: 'jobId', message: 'jobId cannot be empty' }];
  }

  if (!question) {
    return [{ field: 'question', message: 'Question cannot be empty' }];
  }
  if (!answer) {
    return [{ field: 'answer', message: 'Answer cannot be empty' }];
  }

  return null;
};
