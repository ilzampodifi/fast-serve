import { z } from "zod";

export const syncOrderItemValidation = {
  body: z.object({
    unique_id: z.string().min(1, "unique_id is required"),
    menu_item_id: z.string().min(1, "menu_item_id is required"),
    quantity: z.number().int().min(1, "quantity must be at least 1"),
  }),
};

export const getOrderValidation = {
  params: z.object({
    unique_id: z.string().min(1, "unique_id is required"),
  }),
};

export const deleteOrderItemValidation = {
  params: z.object({
    unique_id: z.string().min(1, "unique_id is required"),
    menu_item_id: z.string().min(1, "menu_item_id is required"),
  }),
};

export const confirmOrderValidation = {
  params: z.object({
    unique_id: z.string().min(1, "unique_id is required"),
  }),
};
