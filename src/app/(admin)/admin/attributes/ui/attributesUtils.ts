import { OptionType } from '@prisma/client';
import { MdPalette, MdStraighten, MdTexture, MdSettings } from 'react-icons/md';

export const getIconForType = (type: OptionType) => {
  switch (type) {
    case 'COLOR':
      return MdPalette;
    case 'SIZE':
      return MdStraighten;
    case 'TEXT':
      return MdTexture;
    default:
      return MdSettings;
  }
};

export const getTypeLabel = (type: OptionType): string => {
  switch (type) {
    case 'TEXT':
      return 'Texto';
    case 'COLOR':
      return 'Color';
    case 'SIZE':
      return 'Talla';
    case 'SELECT':
      return 'Selección';
    case 'NUMBER':
      return 'Número';
    default:
      return type;
  }
};
