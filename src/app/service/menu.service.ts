import { MenuModel, Menu } from "../../db/schema/menu.schema";
import { MenuItemModel, MenuItem } from "../../db/schema/menu-item.schema";
import { CreateMenuDto, UpdateMenuDto } from "../entities/menu.entity";

export class MenuService {
  /**
   * Get all active menus based on current time
   */
  public async getActiveMenus(): Promise<Menu[]> {
    try {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      // TODO: Implement logic to filter menus by current time
      // For now, return all menus
      const menus = await MenuModel.find().sort({ createdAt: -1 });
      return menus;
    } catch (error) {
      throw new Error(
        `Failed to get active menus: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get menu by ID
   */
  public async getMenuById(id: string): Promise<Menu | null> {
    try {
      const menu = await MenuModel.findById(id);
      return menu;
    } catch (error) {
      throw new Error(
        `Failed to get menu by ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get all menu items for a specific menu
   */
  public async getMenuItems(menuId: string): Promise<MenuItem[]> {
    try {
      const menuItems = await MenuItemModel.find({ menuId }).sort({
        createdAt: -1,
      });
      return menuItems;
    } catch (error) {
      throw new Error(
        `Failed to get menu items: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Create a new menu
   */
  public async createMenu(menuData: CreateMenuDto): Promise<Menu> {
    try {
      const newMenu = new MenuModel(menuData);
      const savedMenu = await newMenu.save();
      return savedMenu;
    } catch (error) {
      throw new Error(
        `Failed to create menu: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update menu by ID
   */
  public async updateMenu(
    id: string,
    updateData: UpdateMenuDto
  ): Promise<Menu | null> {
    try {
      const updatedMenu = await MenuModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      return updatedMenu;
    } catch (error) {
      throw new Error(
        `Failed to update menu: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete menu by ID
   */
  public async deleteMenu(id: string): Promise<boolean> {
    try {
      const result = await MenuModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(
        `Failed to delete menu: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get menu with its items
   */
  public async getMenuWithItems(
    menuId: string
  ): Promise<{ menu: Menu | null; items: MenuItem[] }> {
    try {
      const [menu, items] = await Promise.all([
        this.getMenuById(menuId),
        this.getMenuItems(menuId),
      ]);

      return { menu, items };
    } catch (error) {
      throw new Error(
        `Failed to get menu with items: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Check if menu is currently active based on time
   */
  public isMenuActive(menu: Menu): boolean {
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    return currentTime >= menu.startTime && currentTime <= menu.endTime;
  }
}
