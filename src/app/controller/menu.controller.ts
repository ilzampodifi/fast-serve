import { Menu, MenuModel } from "@/db/schema/menu.schema";
import { type Request, type Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { AppError, getValidatedData } from "@/middleware/validation.middleware";
import { toMinutes } from "@/utils/schema";
import { Paginated } from "@/types/paginated";
import { MenuItem, MenuItemModel } from "@/db/schema/menu-item.schema";

export class MenuController {
  public getActiveMenu = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { time, page, limit, sort } = getValidatedData(req).query;

      let query = {};

      if (time) {
        const timeInMinutes = toMinutes(time);

        query = {
          $expr: {
            $let: {
              vars: {
                startMinutes: {
                  $add: [
                    {
                      $multiply: [
                        { $toInt: { $substr: ["$startTime", 0, 2] } },
                        60,
                      ],
                    },
                    { $toInt: { $substr: ["$startTime", 3, 2] } },
                  ],
                },
                endMinutes: {
                  $add: [
                    {
                      $multiply: [
                        { $toInt: { $substr: ["$endTime", 0, 2] } },
                        60,
                      ],
                    },
                    { $toInt: { $substr: ["$endTime", 3, 2] } },
                  ],
                },
              },
              in: {
                $or: [
                  // Normal case: startTime <= endTime (e.g., 11:00-15:00)
                  {
                    $and: [
                      { $lte: ["$$startMinutes", "$$endMinutes"] },
                      { $gte: [timeInMinutes, "$$startMinutes"] },
                      { $lte: [timeInMinutes, "$$endMinutes"] },
                    ],
                  },
                  // Cross-midnight case: startTime > endTime (e.g., 22:00-06:00)
                  {
                    $and: [
                      { $gt: ["$$startMinutes", "$$endMinutes"] },
                      {
                        $or: [
                          // Current time is after start time (e.g., 23:00 >= 22:00)
                          { $gte: [timeInMinutes, "$$startMinutes"] },
                          // Current time is before end time (e.g., 05:00 <= 06:00)
                          { $lte: [timeInMinutes, "$$endMinutes"] },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        };
      }

      // Find all menus that are active at the requested time
      // This handles overlapping periods by returning all matching menus
      const [menus, totalCount] = await Promise.all([
        MenuModel.find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort(sort || { type: 1, startTime: 1 }), // Default sort by type then start time
        MenuModel.countDocuments(query),
      ]);

      let result: Paginated<Menu> = {
        data: menus,
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };

      res.status(200).json({
        success: true,
        ...result,
      });
    }
  );

  public getMenuByMenuId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { menuId } = getValidatedData(req).params;
      const { page, limit, sort } = getValidatedData(req).query;

      const items = await MenuItemModel.find({
        $expr: {
          $eq: ["$menuId", menuId],
        },
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort || { name: 1 });

      let result: Paginated<MenuItem> = {
        data: items,
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
      };

      res.status(200).json({
        success: true,
        ...result,
      });
    }
  );

  public getMenuItemDetail = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Use validated data helper function
      const { params } = getValidatedData(req);
      const { menuId, itemId } = params;

      const menu = await MenuModel.findById(menuId);
      if (!menu) {
        throw new AppError("Menu not found", 404, "MENU_NOT_FOUND");
      }

      throw new AppError(
        "Menu item detail endpoint not yet implemented",
        501,
        "NOT_IMPLEMENTED",
        { menuId, itemId }
      );
    }
  );
}
