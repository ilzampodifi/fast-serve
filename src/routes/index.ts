import { Router } from "express";
import menu from "@/routes/menu";
import order from "@/routes/order";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

router.get("/health", (req, res) => {
    res.json({ status: "UP" });
});

router.use("/menu", menu);
router.use("/order", order);

export default router;