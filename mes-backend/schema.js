const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getDashboardMetrics: [DashboardMetrics]
    getAllRawMaterial: [RawMaterial]
    getAllProducts: [Product]
    getAllProductQA: [ProductQualityInspection]
    getRawMaterial(id: Int!): RawMaterial
    getProduct(id: Int!): Product
    getProductQA(id: Int!): ProductQualityInspection
  }

  type Mutation {
    deleteRawMaterial(id: Int!): DeleteResponse
    deleteProduct(id: Int!): DeleteResponse
    deleteProductQA(id: Int!): DeleteResponse
    updateProduct(id: Int!, input: ProductInput!): Product
    updateRawMaterial(id: Int!, input: RawMaterialInput!): RawMaterial
    updateProductQA(
      id: Int!
      input: ProductQualityInspectionInput!
    ): ProductQualityInspection
    createRawMaterial(input: RawMaterialInput!): RawMaterial
    createProduct(input: ProductInput!): Product
    createProductQA(
      input: ProductQualityInspectionInput!
    ): ProductQualityInspection
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  type DashboardMetrics {
    machineUtilization: Float
  }

  type RawMaterial {
    id: Int!
    productId: Int
    name: String
    supplier: String
    quantityRemaining: Int
    quantityUsed: Int
  }

  type MaterialUsed {
    id: Int! # Include this if you want to retrieve the ID of MaterialUsed
    rawMaterialId: Int! # Include rawMaterialId for reference
    name: String # Include productId for reference
    quantityUsed: Int
  }

  type Product {
    id: Int!
    productId: Int
    name: String
    productionStatus: String
    materialUsed: [MaterialUsed]
    dateStart: String
    dateEnd: String
    completed: Boolean
    totalProduct: Int
  }

  type ProductQualityInspection {
    id: Int!
    productId: Int
    name: String
    status: String
    inspectionTime: String
    productPass: Int
    productDefect: Int
  }

  input ProductInput {
    productId: Int
    name: String
    productionStatus: String
    materialUsed: [MaterialUsedInput]
    dateStart: String
    dateEnd: String
    completed: Boolean
    totalProduct: Int
  }

  input MaterialUsedInput {
    rawMaterialId: Int!
    name: String
    quantityUsed: Int
  }

  input RawMaterialInput {
    productId: Int
    name: String
    supplier: String
    quantityRemaining: Int
    quantityUsed: Int
  }

  input ProductQualityInspectionInput {
    productId: Int
    name: String
    status: String
    inspectionTime: String
    productPass: Int
    productDefect: Int
  }
`;

module.exports = typeDefs;
