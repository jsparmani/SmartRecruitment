import { QuestionsInput } from './../resolvers/inputs/QuestionsInput';

export const validateQuestions = (options: QuestionsInput) => {
  const { questions } = options;

  questions.forEach((question): any => {
    if (question == '') {
      return [
        {
          field: 'questions',
          message: 'Questions cannot be empty',
        },
      ];
    }

    if (question.includes(',')) {
      return [
        {
          field: 'questions',
          message: 'Questions cannot have a , in between',
        },
      ];
    }
  });

  return null;
};