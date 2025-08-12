import { z } from "zod";
import { objectIdSchema, paginationSchema, timeSchema } from "./common.validator";

export const getMenuByIdValidation = {
  params: z.object({
    menuId: objectIdSchema.describe("Menu ID"),
  }),
  query: z.object({
    ...paginationSchema.shape,
  }),
};

export const getMenuItemDetailValidation = {
  params: z.object({
    menuId: objectIdSchema.describe("Menu ID"),
    itemId: objectIdSchema.describe("Menu Item ID"),
  }),
};

export const getActiveMenuValidation = {
  query: z.object({
    time: timeSchema,
    ...paginationSchema.shape,
  }),
};
