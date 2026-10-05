/**
 * Cliente único de Cloud Storage — SOLO se importa desde código de servidor
 * (Route Handlers). Nunca importar esto en un componente de cliente.
 */
import { Storage } from '@google-cloud/storage';
import { env } from './env';

const storage = new Storage();

export const kitAssetsBucket = storage.bucket(env.KIT_ASSETS_BUCKET);
