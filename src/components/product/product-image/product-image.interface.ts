export type AdaptiveIntensity = boolean | 'light' | 'medium' | 'dark';

export interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  /**
   * Aplica filtros para reducir el brillo en modo oscuro
   * - true | 'medium': Balance entre calidad y confort (recomendado)
   * - 'light': Filtros sutiles, casi imperceptible
   * - 'dark': Máximo confort visual para sesiones largas
   * - false: Sin filtros
   */
  adaptiveBackground?: AdaptiveIntensity;
  /** Prioridad de carga de la imagen */
  priority?: boolean;
}
