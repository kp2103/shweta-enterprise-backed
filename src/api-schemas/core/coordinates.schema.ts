import { z } from 'zod';

export const latitudeSchema = z.coerce.number().min(-90).max(90);
export const longitudeSchema = z.coerce.number().min(-180).max(180);

// Backward compatibility aliases
export const latitudeValidator = latitudeSchema;
export const longitudeValidator = longitudeSchema;

export type LatitudeSchema = z.infer<typeof latitudeSchema>;
export type LongitudeSchema = z.infer<typeof longitudeSchema>;
