import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().optional(),
  VITE_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  VITE_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  MODE: z.enum(["development", "production"]).default("development"),
});

type EnvConfig = z.infer<typeof envSchema>;

let cachedEnv: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (cachedEnv) {
    return cachedEnv;
  }

  const env = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    VITE_CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    MODE: import.meta.env.MODE,
  };

  try {
    cachedEnv = envSchema.parse(env);
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.error("[EnvValidation] Invalid environment variables:", messages);
      // In development, continue with warnings; in production, fail
      if (import.meta.env.MODE === "production") {
        throw new Error(`Environment configuration error: ${messages}`);
      }
    }
    // Return partial config even if validation fails
    cachedEnv = env as EnvConfig;
    return cachedEnv;
  }
}

export const API_BASE_URL =
  getEnv().VITE_API_BASE_URL || "http://localhost:5000/api";

export const CLOUDINARY_CONFIG = {
  cloudName: getEnv().VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: getEnv().VITE_CLOUDINARY_UPLOAD_PRESET,
};

export function isCloudinaryConfigured(): boolean {
  return !!(
    CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.uploadPreset
  );
}
