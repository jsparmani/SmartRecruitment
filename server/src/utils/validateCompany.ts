import { CompanyInput } from './../resolvers/inputs/CompanyInput';

export const validateCompany = (options: CompanyInput) => {
  const { name, location } = options;

  if (!name) {
    return [{ field: 'name', message: 'cannot be empty' }];
  }

  if (!location) {
    return [{ field: 'location', message: 'cannot be empty' }];
  }

  return null;
};
