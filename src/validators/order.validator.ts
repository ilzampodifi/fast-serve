import { z } from "zod";
import { paginationSchema } from "./common.validator";

export const getOrderValidation = {
  query: z.object({
    ...paginationSchema.shape,
  }),
};