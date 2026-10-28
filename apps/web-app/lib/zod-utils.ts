import { z } from "zod";

export function isFieldRequired(
  schema: z.ZodTypeAny,
  fieldName: string,
): boolean {
  let currentSchema = schema;

  while ("innerType" in currentSchema._def) {
    currentSchema = (currentSchema._def as any).innerType;
  }

  if (currentSchema instanceof z.ZodObject) {
    const shape = currentSchema.shape;
    const field = shape[fieldName];

    if (!field) return false;

    return !field.isOptional() && !field.isNullable();
  }

  return false;
}
