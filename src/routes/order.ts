import { Router } from "express";
import OrderController from "../app/controller/order.controller";

const router = Router();

// Sync order item (add or update)
router.post("/sync-item", OrderController.syncOrderItem);

// Get order by unique_id
router.get("/:unique_id", OrderController.getOrder);

// Delete order item
router.delete(
  "/:unique_id/item/:menu_item_id",
  OrderController.deleteOrderItem
);

// Confirm order (delete from memory)
router.post("/:unique_id/confirm", OrderController.confirmOrder);

export default router;
