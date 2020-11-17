import { registerEnumType } from 'type-graphql';
export enum Department {
  ACCOUNTING = 'accounting',
  HR = 'hr',
  MANAGEMENT = 'management',
  MARKETING = 'marketing',
  PROD_MANAGEMENT = 'product management',
  SALES = 'sales',
  SUPPORT = 'support',
  TECHNICAL = 'technical',
  OTHERS = 'others',
}

registerEnumType(Department, {
  name: 'Department',
});
