/**
 * Combina clases CSS de forma segura, ignorando valores falsy
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Crea un objeto de clases CSS condicionales
 */
export function classNames(
  base: string,
  conditional: Record<string, boolean | undefined>
): string {
  const conditionalClasses = Object.entries(conditional)
    .filter(([, condition]) => condition)
    .map(([className]) => className);

  return cn(base, ...conditionalClasses);
}

/**
 * Merge estilos CSS objects
 */
export function mergeStyles(
  baseStyles: React.CSSProperties,
  ...additionalStyles: (React.CSSProperties | undefined)[]
): React.CSSProperties {
  return additionalStyles.reduce<React.CSSProperties>(
    (merged, style) => (style ? { ...merged, ...style } : merged),
    baseStyles
  );
}
