export type FieldType = 'text' | 'textarea' | 'image' | 'color' | 'number' | 'youtube';

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  defaultValue: string;
  placeholder?: string;
  min?: number;
  max?: number;
  /** youtube fields: ids of the fields whose values make up the "Find on YouTube" search */
  searchFrom?: string[];
}

export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'decoration';
  fields: FieldDef[];
}

export interface CanvasItem {
  instanceId: string;
  templateId: string;
  values: Record<string, string>;
}
