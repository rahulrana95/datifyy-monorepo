/**
 * Questions Type
 * Auto-generated from TypeORM entity: Questions
 */

export interface QuestionsType {
  id: number;
  title: string;
  createdBy: number;
}

// Utility types for Questions
export type CreateQuestionsInput = Omit<QuestionsType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuestionsInput = Partial<Omit<QuestionsType, 'id' | 'createdAt' | 'updatedAt'>>;
export type QuestionsId = QuestionsType['id'];
