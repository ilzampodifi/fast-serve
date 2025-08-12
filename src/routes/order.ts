import { Router } from "express";

const router = Router();

// get all orders
router.get("/", (req, res) => {
  res.send("Hello World");
});

// get all menu
router.get("/:id", (req, res) => {
  res.send("Hello World");
});

router.post("/", (req, res) => {
  res.send("Hello World");
});

router.put("/:id", (req, res) => {
  res.send("Hello World");
});


export default router;