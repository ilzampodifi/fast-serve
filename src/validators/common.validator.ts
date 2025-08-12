import { HHMM_VALIDATOR } from "@/utils/schema";
import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be greater than 0")
    .describe("Page number (default: 1)"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
    .describe("Items per page (default: 10, max: 100)"),
  sort: z
    .string()
    .optional()
    .refine(
      (val) => !val || ["asc", "desc"].includes(val),
      'Sort must be "asc" or "desc"'
    )
    .describe("Sort order (asc or desc)"),
});

export const objectIdSchema = z
  .string()
  .min(1, "ID is required")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")
  .describe("MongoDB ObjectId (24 character hex string)");

export const timeSchema = z
  .string()
  .min(1, "Time is required")
  .refine(HHMM_VALIDATOR, {
    message: "Time must be in HH:MM format (24-hour)",
  })
  .describe("Time in HH:MM format (e.g., 09:30, 14:45)");
