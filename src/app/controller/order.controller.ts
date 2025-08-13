import { Request, Response } from "express";
import { MenuItemModel } from "../../db/schema/menu-item.schema";

// In-memory order storage
interface OrderItem {
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  totalPrice: number;
}

interface Order {
  uniqueId: string;
  finalTotal: number;
  orderItems: OrderItem[];
}

// In-memory storage using Map
const orderStorage: Map<string, Order> = new Map();

export default class OrderController {
  // Sync order item (add or update)
  static async syncOrderItem(req: Request, res: Response) {
    try {
      const { unique_id, menu_item_id, quantity } = req.body;

      // Validate required fields
      if (!unique_id || !menu_item_id || !quantity) {
        return res.status(400).json({
          success: false,
          message: "unique_id, menu_item_id, and quantity are required",
        });
      }

      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be greater than 0",
        });
      }

      // Query menu item from database
      const menuItem = await MenuItemModel.findById(menu_item_id);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found",
        });
      }

      // Create order item
      const orderItem: OrderItem = {
        menuItemId: menuItem._id.toString(),
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        image: menuItem.image,
        quantity: quantity,
        totalPrice: menuItem.price * quantity,
      };

      // Check if order exists
      let existingOrder = orderStorage.get(unique_id);

      if (!existingOrder) {
        // Create new order
        const newOrder: Order = {
          uniqueId: unique_id,
          finalTotal: orderItem.totalPrice,
          orderItems: [orderItem],
        };
        orderStorage.set(unique_id, newOrder);
      } else {
        // Update existing order
        const existingItemIndex = existingOrder.orderItems.findIndex(
          (item) => item.menuItemId === menu_item_id
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          existingOrder.orderItems[existingItemIndex] = orderItem;
        } else {
          // Add new item
          existingOrder.orderItems.push(orderItem);
        }

        // Recalculate total
        existingOrder.finalTotal = existingOrder.orderItems.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      }

      const updatedOrder = orderStorage.get(unique_id);

      return res.status(200).json({
        success: true,
        message: "Order item added successfully",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error adding order item:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get order by unique_id
  static async getOrder(req: Request, res: Response) {
    try {
      const { unique_id } = req.params;

      if (!unique_id) {
        return res.status(400).json({
          success: false,
          message: "unique_id is required",
        });
      }

      const order = orderStorage.get(unique_id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Error getting order:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Delete order item
  static async deleteOrderItem(req: Request, res: Response) {
    try {
      const { unique_id, menu_item_id } = req.params;

      if (!unique_id || !menu_item_id) {
        return res.status(400).json({
          success: false,
          message: "unique_id and menu_item_id are required",
        });
      }

      const existingOrder = orderStorage.get(unique_id);

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Find the item index
      const itemIndex = existingOrder.orderItems.findIndex(
        (item) => item.menuItemId === menu_item_id
      );

      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Order item not found",
        });
      }

      // Remove the item
      existingOrder.orderItems.splice(itemIndex, 1);

      // If no items left, remove the entire order
      if (existingOrder.orderItems.length === 0) {
        orderStorage.delete(unique_id);
        return res.status(200).json({
          success: true,
          message: "Order item deleted and order removed (no items left)",
          data: null,
        });
      }

      // Recalculate total
      existingOrder.finalTotal = existingOrder.orderItems.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      return res.status(200).json({
        success: true,
        message: "Order item deleted successfully",
        data: existingOrder,
      });
    } catch (error) {
      console.error("Error deleting order item:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Confirm order (delete from memory)
  static async confirmOrder(req: Request, res: Response) {
    try {
      const { unique_id } = req.params;

      if (!unique_id) {
        return res.status(400).json({
          success: false,
          message: "unique_id is required",
        });
      }

      const order = orderStorage.get(unique_id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Remove order from memory
      orderStorage.delete(unique_id);

      return res.status(200).json({
        success: true,
        message: "Order confirmed and removed from memory",
        data: order,
      });
    } catch (error) {
      console.error("Error confirming order:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
