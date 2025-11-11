import React from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { getDropZoneStyles, getDropZoneTextStyles } from '../styles';
import type { DropZoneProps } from '../image-uploader.interface';

export const DropZone: React.FC<DropZoneProps> = ({
  isDragActive,
  getRootProps,
  getInputProps,
  isDark,
  disabled,
}) => {
  const containerStyles = getDropZoneStyles(isDark, isDragActive);
  const textStyles = getDropZoneTextStyles(isDark);

  return (
    <div
      {...getRootProps()}
      className={containerStyles}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      <input {...getInputProps()} />

      <IoCloudUploadOutline
        className={`w-12 h-12 mx-auto mb-3 transition-colors ${
          isDragActive ? 'text-blue-500' : 'text-gray-400'
        }`}
      />

      {isDragActive ? (
        <p className={textStyles.dragActive}>Suelta las imágenes aquí...</p>
      ) : (
        <div>
          <p className={textStyles.primary}>Arrastra imágenes o haz clic para seleccionar</p>
          <p className={textStyles.secondary}>Formatos: PNG, JPEG, WebP (Max. 5MB por archivo)</p>
        </div>
      )}
    </div>
  );
};
