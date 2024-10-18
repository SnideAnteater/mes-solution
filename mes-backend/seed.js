const sequelize = require("./db");
const {
  DashboardMetrics,
  RawMaterial,
  Product,
  ProductQualityInspection,
} = require("./models");

async function seedDatabase() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log("Database connected!");

    // Sync all models (optional: use { force: true } to drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log("Database synchronized!");

    // Dummy data for DashboardMetrics
    await DashboardMetrics.create({
      machineUtilization: 78.5,
    });

    // Dummy data for RawMaterial
    const rawMaterial = await RawMaterial.bulkCreate([
      {
        productId: 1,
        name: "Steel",
        supplier: "Steel Co.",
        quantityRemaining: 1000,
        quantityUsed: 140,
      },
      {
        productId: 2,
        name: "Plastic",
        supplier: "Plastic Inc.",
        quantityRemaining: 500,
        quantityUsed: 50,
      },
    ]);

    console.log("Raw materials inserted successfully!");

    // Dummy data for Products
    const products = await Product.bulkCreate([
      {
        productId: 1,
        name: "Widget A",
        productionStatus: "In Production",
        dateStart: new Date("2024-10-01"),
        dateEnd: new Date("2024-10-15"),
        materialUsed: [
          {
            rawMaterialId: 1,
            name: "Steel",
            quantityUsed: 50,
          },
        ],
        completed: false,
        totalProduct: 100,
      },
      {
        productId: 2,
        name: "Widget B",
        productionStatus: "Completed",
        dateStart: new Date("2024-09-15"),
        dateEnd: new Date("2024-09-30"),
        materialUsed: [
          {
            rawMaterialId: 1,
            name: "Steel",
            quantityUsed: 40,
          },
          {
            rawMaterialId: 2,
            name: "Plastic",
            quantityUsed: 40,
          },
        ],
        completed: true,
        totalProduct: 400,
      },
      {
        productId: 3,
        name: "Widget C",
        productionStatus: "Completed",
        dateStart: new Date("2024-04-15"),
        dateEnd: new Date("2024-05-30"),
        materialUsed: [
          {
            rawMaterialId: 1,
            name: "Steel",
            quantityUsed: 50,
          },
          {
            rawMaterialId: 2,
            name: "Plastic",
            quantityUsed: 10,
          },
        ],
        completed: true,
        totalProduct: 200,
      },
    ]);

    console.log("Products inserted successfully!");

    console.log("Material usage records inserted successfully!");

    // Dummy data for ProductQualityInspection
    await ProductQualityInspection.bulkCreate([
      {
        productId: 1,
        name: "Widget B",
        status: "In Progress",
        inspectionTime: new Date("2024-10-10"),
        productPass: 100,
        productDefect: 0,
      },
      {
        productId: 2,
        name: "Widget C",
        status: "Completed",
        inspectionTime: new Date("2024-06-29"),
        productPass: 80,
        productDefect: 120,
      },
    ]);

    console.log("Quality inspections inserted successfully!");

    console.log("Dummy data inserted successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seeding function
// Uncomment the line below to execute the seeding
// seedDatabase();

module.exports = seedDatabase;
