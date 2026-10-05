/**
 * Variables de entorno del servidor. Único punto de lectura de process.env
 * — el resto del código nunca toca process.env directamente.
 */
export const env = {
  // Bucket de borrador del editor del kit — deliberadamente DISTINTO de
  // minedec-design-tokens (el que lee el geovisor en producción, visible
  // al cliente). Nunca deben apuntar al mismo bucket.
  KIT_ASSETS_BUCKET: process.env.KIT_ASSETS_BUCKET ?? 'minedec-kit-assets',
} as const;
