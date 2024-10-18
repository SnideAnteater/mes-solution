const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// Define DashboardMetrics Model
const DashboardMetrics = sequelize.define("DashboardMetrics", {
  machineUtilization: DataTypes.FLOAT,
});

// Define RawMaterial Model
const RawMaterial = sequelize.define("RawMaterial", {
  productId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  supplier: DataTypes.STRING,
  quantityRemaining: DataTypes.INTEGER,
  quantityUsed: DataTypes.INTEGER,
});

// Define Product Model
const Product = sequelize.define("Product", {
  productId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  totalProduct: DataTypes.INTEGER,
  productionStatus: DataTypes.STRING,
  dateStart: DataTypes.DATE,
  dateEnd: DataTypes.DATE,
  completed: DataTypes.BOOLEAN,
  materialUsed: DataTypes.ARRAY(DataTypes.JSON),
});

// const MaterialUsed = sequelize.define("MaterialUsed", {
//   productId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Product,
//       key: "id",
//     },
//   },
//   rawMaterialId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: RawMaterial,
//       key: "id",
//     },
//   },
//   quantityUsed: DataTypes.INTEGER,
// });

// Define ProductQualityInspection Model
const ProductQualityInspection = sequelize.define("ProductQualityInspection", {
  productId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  status: DataTypes.STRING,
  inspectionTime: DataTypes.DATE,
  productPass: DataTypes.INTEGER,
  productDefect: DataTypes.INTEGER,
});

// Define associations centrally
// Product.hasMany(MaterialUsed, { foreignKey: "productId" });
// RawMaterial.hasMany(MaterialUsed, { foreignKey: "rawMaterialId" });
// MaterialUsed.belongsTo(Product, { foreignKey: "productId" });
// MaterialUsed.belongsTo(RawMaterial, { foreignKey: "rawMaterialId" });

// Export all models as a single object
module.exports = {
  DashboardMetrics,
  RawMaterial,
  Product,
  ProductQualityInspection,
  sequelize, // Optional, in case you need to sync or authenticate in other files
};
