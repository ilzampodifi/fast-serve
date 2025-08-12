import { connectMongo } from "./index";
import { getConfig } from "../config";
import { MenuModel } from "./schema/menu.schema";
import { MenuItemModel } from "./schema/menu-item.schema";
import { OrderModel } from "./schema/order.schema";
import { OrderItemModel } from "./schema/order-item.schema";

const sampleMenuData = [
  {
    type: "Appetizers",
    items: [
      {
        name: "Buffalo Wings",
        description:
          "Crispy chicken wings tossed in our signature buffalo sauce, served with celery sticks and blue cheese dip",
        price: 12.99,
        image:
          "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
      },
      {
        name: "Loaded Nachos",
        description:
          "Tortilla chips topped with melted cheese, jalapeños, sour cream, and guacamole",
        price: 10.99,
        image:
          "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
      },
      {
        name: "Mozzarella Sticks",
        description:
          "Golden fried mozzarella sticks served with marinara sauce",
        price: 8.99,
        image:
          "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    type: "Main Courses",
    items: [
      {
        name: "Classic Burger",
        description:
          "Juicy beef patty with lettuce, tomato, onion, and our special sauce on a toasted bun",
        price: 15.99,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      },
      {
        name: "Grilled Salmon",
        description:
          "Fresh Atlantic salmon grilled to perfection, served with lemon herb rice and seasonal vegetables",
        price: 22.99,
        image:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
      },
      {
        name: "Chicken Parmesan",
        description:
          "Breaded chicken breast topped with marinara sauce and mozzarella, served with spaghetti",
        price: 18.99,
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      },
      {
        name: "Ribeye Steak",
        description:
          "12oz ribeye steak grilled to your liking, served with mashed potatoes and steamed broccoli",
        price: 28.99,
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    type: "Pasta",
    items: [
      {
        name: "Spaghetti Carbonara",
        description:
          "Classic Italian pasta with pancetta, eggs, parmesan cheese, and black pepper",
        price: 16.99,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      },
      {
        name: "Fettuccine Alfredo",
        description:
          "Creamy alfredo sauce tossed with fettuccine pasta and topped with parmesan",
        price: 14.99,
        image:
          "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop",
      },
      {
        name: "Penne Arrabbiata",
        description:
          "Spicy tomato sauce with garlic, red peppers, and herbs over penne pasta",
        price: 13.99,
        image:
          "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    type: "Desserts",
    items: [
      {
        name: "Chocolate Lava Cake",
        description:
          "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream",
        price: 7.99,
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
      },
      {
        name: "Tiramisu",
        description:
          "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
        price: 6.99,
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
      },
      {
        name: "New York Cheesecake",
        description:
          "Rich and creamy cheesecake with graham cracker crust and berry compote",
        price: 6.99,
        image:
          "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    type: "Beverages",
    items: [
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 4.99,
        image:
          "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop",
      },
      {
        name: "Craft Beer",
        description: "Local craft beer selection",
        price: 5.99,
        image:
          "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
      },
      {
        name: "House Wine",
        description: "Red or white wine by the glass",
        price: 7.99,
        image:
          "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
      },
      {
        name: "Specialty Coffee",
        description: "Freshly brewed coffee with your choice of preparation",
        price: 3.99,
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      },
    ],
  },
];

async function clearDatabase() {
  console.log("🗑️  Clearing existing data...");
  await Promise.all([
    MenuModel.deleteMany({}),
    MenuItemModel.deleteMany({}),
    OrderModel.deleteMany({}),
    OrderItemModel.deleteMany({}),
  ]);
  console.log("✅ Database cleared");
}

async function seedMenus() {
  console.log("🌱 Seeding menus and menu items...");

  for (const menuData of sampleMenuData) {
    const menu = new MenuModel({
      type: menuData.type,
      items: menuData.items,
    });

    await menu.save();
    console.log(
      `   ✅ Created menu: ${menuData.type} with ${menuData.items.length} items`
    );
  }
}

async function createSampleOrders() {
  console.log("🛒 Creating sample orders...");

  // Get some menu items to create sample orders
  const menus = await MenuModel.find();
  const allMenuItems = menus.flatMap((menu) => menu.items);

  // Create a few sample orders
  const sampleOrders = [
    {
      items: [
        { menuItem: allMenuItems[0], quantity: 2 },
        { menuItem: allMenuItems[4], quantity: 1 },
      ],
      total: allMenuItems[0].price * 2 + allMenuItems[4].price,
    },
    {
      items: [
        { menuItem: allMenuItems[1], quantity: 1 },
        { menuItem: allMenuItems[2], quantity: 1 },
        { menuItem: allMenuItems[12], quantity: 2 },
      ],
      total:
        allMenuItems[1].price +
        allMenuItems[2].price +
        allMenuItems[12].price * 2,
    },
  ];

  for (const orderData of sampleOrders) {
    // Create order items first
    const orderItems = [];
    for (const item of orderData.items) {
      const orderItem = new OrderItemModel({
        menuItem: item.menuItem,
        quantity: item.quantity,
      });
      await orderItem.save();
      orderItems.push(orderItem);
    }

    // Create the order
    const order = new OrderModel({
      total: orderData.total,
    });
    await order.save();

    console.log(
      `   ✅ Created order with ${
        orderItems.length
      } items (Total: $${orderData.total.toFixed(2)})`
    );
  }
}

async function seed() {
  try {
    console.log("🚀 Starting database seeding...");

    // Connect to database
    const config = getConfig();
    await connectMongo(config.MONGODB_URI);

    // Clear existing data
    await clearDatabase();

    // Seed new data
    await seedMenus();
    await createSampleOrders();

    console.log("🎉 Database seeding completed successfully!");

    // Show summary
    const menuCount = await MenuModel.countDocuments();
    const orderCount = await OrderModel.countDocuments();
    const orderItemCount = await OrderItemModel.countDocuments();

    console.log("\n📊 Seeding Summary:");
    console.log(`   • Menus: ${menuCount}`);
    console.log(`   • Orders: ${orderCount}`);
    console.log(`   • Order Items: ${orderItemCount}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

// Run the seeder
seed();
