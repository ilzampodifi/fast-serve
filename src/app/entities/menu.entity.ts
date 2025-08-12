import { Menu, MenuItem } from "../../db/schema/menu.schema";

/**
 * Data Transfer Object for creating a new menu
 */
export interface CreateMenuDto {
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
}

/**
 * Data Transfer Object for updating a menu
 */
export interface UpdateMenuDto {
  name?: string;
  type?: "breakfast" | "lunch" | "dinner" | "snack";
  startTime?: string; // Format: HH:MM
  endTime?: string; // Format: HH:MM
}

/**
 * Response DTO for menu with items
 */
export interface MenuWithItemsDto {
  menu: Menu;
  items: MenuItem[];
  isActive: boolean;
}

/**
 * Response DTO for active menus
 */
export interface ActiveMenusResponseDto {
  activeMenus: Menu[];
  currentTime: string;
}

/**
 * Base response structure for API responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

/**
 * Menu filter options for queries
 */
export interface MenuFilterOptions {
  type?: "breakfast" | "lunch" | "dinner" | "snack";
  isActive?: boolean;
  sortBy?: "name" | "type" | "startTime" | "endTime" | "createdAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * Menu statistics DTO
 */
export interface MenuStatsDto {
  totalMenus: number;
  menusByType: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  activeMenusCount: number;
}

/**
 * Menu validation result
 */
export interface MenuValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Time range validation
 */
export interface TimeRangeDto {
  startTime: string;
  endTime: string;
}
