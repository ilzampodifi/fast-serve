import { Menu, MenuModel } from "@/db/schema/menu.schema";
import { type Request, type Response } from "express";
import { asyncHandler } from "@/utils/errors";
import {
  AppError,
  getValidatedData,
} from "@/app/middleware/validation.middleware";
import { toMinutes } from "@/utils/schema";
import { MenuItemModel } from "@/db/schema/menu-item.schema";

export class MenuController {
  public getActiveMenu = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { time } = getValidatedData(req).query;

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
      const menus = await MenuModel.find(query);

      res.status(200).json({
        success: true,
        data: menus,
      });
    }
  );

  public getMenuByMenuId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { menuId } = getValidatedData(req).params;

      const items = await MenuItemModel.find({
        $expr: {
          $eq: ["$menuId", menuId],
        },
      });

      res.status(200).json({
        success: true,
        data: items,
      });
    }
  );

  public getMenuItemDetail = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { menuId, itemId } = getValidatedData(req).params;

      const item = await MenuItemModel.findOne({
        $expr: {
          $and: [{ $eq: ["$menuId", menuId] }, { $eq: ["$_id", itemId] }],
        },
      });

      res.status(200).json({
        success: true,
        data: item,
      });
    }
  );
}
