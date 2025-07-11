/**
 * CompanyTags Type
 * Auto-generated from TypeORM entity: CompanyTags
 */

export interface CompanyTagsType {
  companyId: number;
  slug: string;
  label: string;
}

// Utility types for CompanyTags
export type CreateCompanyTagsInput = Omit<CompanyTagsType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCompanyTagsInput = Partial<Omit<CompanyTagsType, 'id' | 'createdAt' | 'updatedAt'>>;
export type CompanyTagsId = CompanyTagsType['companyId'];
