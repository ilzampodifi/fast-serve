import { Router } from "express";
import OrderController from "../app/controller/order.controller";

const router = Router();

router.post("/sync-item", OrderController.syncOrderItem);
router.get("/:unique_id", OrderController.getOrder);
router.delete(
  "/:unique_id/item/:menu_item_id",
  OrderController.deleteOrderItem
);
router.post("/:unique_id/confirm", OrderController.confirmOrder);

export default router;
