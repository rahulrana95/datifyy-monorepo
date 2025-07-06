    import { IconType } from 'react-icons';
import { DatifyyUsersInformation } from '../../../service/userService/UserProfileTypes';

export interface FormFieldConfig {
  name: keyof DatifyyUsersInformation;
  label: string;
  type: 'text' | 'email' | 'date' | 'number' | 'select' | 'checkbox' | 'city' | 'image' | 'textarea' | 'tag-input' | 'verification';
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  min?: number;
  max?: number;
  maxLength?: number;
  maxTags?: number;
}

export interface FormSectionConfig {
  id: string;
  title: string;
  description: string;
  icon?: IconType;
  fields: FormFieldConfig[][];
}

