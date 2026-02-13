export interface InventoryItemDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  canCombineWith?: string[];
  combinationResult?: string;
  isKey?: boolean;
}
