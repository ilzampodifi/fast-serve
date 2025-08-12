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
      {
        name: "Calamari Rings",
        description:
          "Crispy fried squid rings served with spicy marinara sauce",
        price: 11.99,
        image:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
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
      {
        name: "BBQ Ribs",
        description:
          "Fall-off-the-bone pork ribs with our signature BBQ sauce, served with coleslaw and fries",
        price: 24.99,
        image:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
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
      {
        name: "Lasagna Bolognese",
        description:
          "Layers of pasta with rich meat sauce, béchamel, and three cheeses",
        price: 17.99,
        image:
          "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    type: "Pizza",
    items: [
      {
        name: "Margherita Pizza",
        description:
          "Classic pizza with tomato sauce, fresh mozzarella, and basil",
        price: 14.99,
        image:
          "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
      },
      {
        name: "Pepperoni Pizza",
        description:
          "Traditional pizza topped with spicy pepperoni and mozzarella cheese",
        price: 16.99,
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
      },
      {
        name: "Quattro Stagioni",
        description:
          "Four seasons pizza with artichokes, ham, mushrooms, and olives",
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
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
      {
        name: "Iced Tea",
        description: "Refreshing iced tea with lemon",
        price: 2.99,
        image:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
      },
    ],
  },
];

async function clearDatabase() {
  console.log("🗑️  Clearing existing data...");
  await Promise.all([
    OrderItemModel.deleteMany({}),
    OrderModel.deleteMany({}),
    MenuItemModel.deleteMany({}),
    MenuModel.deleteMany({}),
  ]);
  console.log("✅ Database cleared");
}

async function seedMenusAndItems() {
  console.log("🌱 Seeding menus and menu items...");

  const createdMenus = [];

  for (const menuData of sampleMenuData) {
    // Create the menu first (without items in embedded schema)
    const menu = new MenuModel({
      type: menuData.type,
      items: [], // Empty for now, we'll update after creating menu items
    });

    const savedMenu = await menu.save();
    createdMenus.push(savedMenu);

    // Create individual menu items with reference to the menu
    const menuItems = [];
    for (const itemData of menuData.items) {
      const menuItem = new MenuItemModel({
        menu: savedMenu._id,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        image: itemData.image,
      });

      const savedMenuItem = await menuItem.save();
      menuItems.push(savedMenuItem);
    }

    // Update the menu with the embedded items
    savedMenu.items.push(...menuItems);
    await savedMenu.save();

    console.log(
      `   ✅ Created menu: ${menuData.type} with ${menuItems.length} items`
    );
  }

  return createdMenus;
}

async function createSampleOrders() {
  console.log("🛒 Creating sample orders...");

  // Get all menu items for creating orders
  const allMenuItems = await MenuItemModel.find();

  if (allMenuItems.length === 0) {
    console.log("❌ No menu items found to create orders");
    return;
  }

  // Create 15-20 sample orders for pagination testing
  const orderStatuses = ["pending", "paid", "cancelled"];
  const orders = [];

  for (let i = 1; i <= 18; i++) {
    // Random number of items per order (1-4 items)
    const numItems = Math.floor(Math.random() * 4) + 1;
    const selectedItems = [];

    // Select random menu items
    for (let j = 0; j < numItems; j++) {
      const randomIndex = Math.floor(Math.random() * allMenuItems.length);
      const menuItem = allMenuItems[randomIndex];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity

      selectedItems.push({
        menuItem,
        quantity,
        total: menuItem.price * quantity,
      });
    }

    // Calculate final total
    const finalTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);

    // Create the order
    const order = new OrderModel({
      finalTotal,
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      items: [], // Will be updated after creating order items
    });

    const savedOrder = await order.save();

    // Create order items with reference to the order
    const orderItems = [];
    for (const itemData of selectedItems) {
      const orderItem = new OrderItemModel({
        order: savedOrder._id,
        menuItem: {
          _id: itemData.menuItem._id,
          menu: itemData.menuItem.menu,
          name: itemData.menuItem.name,
          description: itemData.menuItem.description,
          price: itemData.menuItem.price,
          image: itemData.menuItem.image,
          createdAt: itemData.menuItem.createdAt,
          updatedAt: itemData.menuItem.updatedAt,
        },
        quantity: itemData.quantity,
        total: itemData.total,
      });

      const savedOrderItem = await orderItem.save();
      orderItems.push(savedOrderItem);
    }

    // Update the order with embedded order items
    savedOrder.items.push(...orderItems);
    await savedOrder.save();
    orders.push(savedOrder);

    console.log(
      `   ✅ Order #${i}: ${orderItems.length} items, Status: ${
        savedOrder.status
      }, Total: $${finalTotal.toFixed(2)}`
    );
  }

  return orders;
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
    const menus = await seedMenusAndItems();
    const orders = await createSampleOrders();

    console.log("🎉 Database seeding completed successfully!");

    // Show summary
    const menuCount = await MenuModel.countDocuments();
    const menuItemCount = await MenuItemModel.countDocuments();
    const orderCount = await OrderModel.countDocuments();
    const orderItemCount = await OrderItemModel.countDocuments();

    console.log("\n📊 Seeding Summary:");
    console.log(`   • Menus: ${menuCount}`);
    console.log(`   • Menu Items: ${menuItemCount}`);
    console.log(`   • Orders: ${orderCount}`);
    console.log(`   • Order Items: ${orderItemCount}`);

    console.log("\n🔗 Relationship Summary:");
    console.log(`   • Each Menu has multiple MenuItems (1:N)`);
    console.log(`   • Each Order has multiple OrderItems (1:N)`);
    console.log(`   • MenuItems reference their parent Menu`);
    console.log(`   • OrderItems reference their parent Order`);

    console.log("\n📄 Pagination Testing:");
    console.log(`   • Created ${orderCount} orders for pagination testing`);
    console.log(`   • Recommended page size: 5-10 items per page`);
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
