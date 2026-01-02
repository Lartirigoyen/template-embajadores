import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '~/server/config/env';

/**
 * Cliente S3 configurado
 * Compatible con AWS S3 y MinIO
 */
export const s3Client = env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
  ? new S3Client({
      region: env.S3_REGION,
      endpoint: env.S3_ENDPOINT,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: env.S3_FORCE_PATH_STYLE ?? false,
    })
  : null;

export interface UploadFileParams {
  key: string;
  body: Buffer | ReadableStream | Blob;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface DownloadFileParams {
  key: string;
}

export interface DeleteFileParams {
  key: string;
}

export interface ListFilesParams {
  prefix?: string;
  maxKeys?: number;
}

export interface GetSignedUrlParams {
  key: string;
  expiresIn?: number; // segundos, default 3600 (1 hora)
}

/**
 * Subir archivo a S3
 */
export async function uploadFile({ key, body, contentType, metadata }: UploadFileParams) {
  if (!s3Client || !env.S3_BUCKET_NAME) {
    throw new Error('S3 no está configurado');
  }

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
    },
  });

  const result = await upload.done();
  return result;
}

/**
 * Descargar archivo de S3
 */
export async function downloadFile({ key }: DownloadFileParams) {
  if (!s3Client || !env.S3_BUCKET_NAME) {
    throw new Error('S3 no está configurado');
  }

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  return response;
}

/**
 * Eliminar archivo de S3
 */
export async function deleteFile({ key }: DeleteFileParams) {
  if (!s3Client || !env.S3_BUCKET_NAME) {
    throw new Error('S3 no está configurado');
  }

  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Listar archivos en S3
 */
export async function listFiles({ prefix, maxKeys = 1000 }: ListFilesParams) {
  if (!s3Client || !env.S3_BUCKET_NAME) {
    throw new Error('S3 no está configurado');
  }

  const command = new ListObjectsV2Command({
    Bucket: env.S3_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await s3Client.send(command);
  return response.Contents ?? [];
}

/**
 * Verificar si un archivo existe en S3
 */
export async function fileExists(key: string): Promise<boolean> {
  if (!s3Client || !env.S3_BUCKET_NAME) {
    throw new Error('S3 no está configurado');
  }

  try {
    const command = new HeadObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtener URL firmada para acceso temporal
 */
export async function getFileSignedUrl({ key, expiresIn = 3600 }: GetSignedUrlParams) {
  if (!s3Client || !env.S3_BUCKET_NAME) {
    throw new Error('S3 no está configurado');
  }

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Generar clave única para archivo
 */
export function generateFileKey(prefix: string, filename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${prefix}/${timestamp}-${randomString}-${sanitizedFilename}`;
}
