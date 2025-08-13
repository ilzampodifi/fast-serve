import { MenuController } from "@/app/controller/menu.controller";
import { validate } from "@/app/middleware/validation.middleware";
import {
  getActiveMenuValidation,
  getMenuByIdValidation,
  getMenuItemDetailValidation,
} from "@/validators/menu.validators";
import { Router } from "express";

const router = Router();
const controller = new MenuController();

router.get("/", validate(getActiveMenuValidation), controller.getActiveMenu);
router.get(
  "/:menuId",
  validate(getMenuByIdValidation),
  controller.getMenuByMenuId
);
router.get(
  "/:menuId/:itemId",
  validate(getMenuItemDetailValidation),
  controller.getMenuItemDetail
);

export default router;
