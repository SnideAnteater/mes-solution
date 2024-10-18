const {
  DashboardMetrics,
  RawMaterial,
  Product,
  ProductQualityInspection,
} = require("./models");

const resolvers = {
  Query: {
    getDashboardMetrics: async () => {
      return await DashboardMetrics.findAll();
    },
    getAllRawMaterial: async () => {
      return await RawMaterial.findAll();
    },
    getAllProducts: async () => {
      const products = await Product.findAll();
      return products;
    },
    getAllProductQA: async () => {
      return await ProductQualityInspection.findAll();
    },
    getRawMaterial: async ({ id }) => {
      return await RawMaterial.findByPk(id);
    },
    getProduct: async ({ id }) => {
      return await Product.findByPk(id);
    },
    getProductQA: async ({ id }) => {
      return await ProductQualityInspection.findByPk(id);
    },
  },
  Mutation: {
    updateProduct: async (_, { id, input }) => {
      let record = await Product.findByPk(id);
      if (record) {
        const [updatedRowsCount] = await Product.update(input, {
          where: { id },
        });
        record = await Product.findByPk(id);
        return record;
      }
      throw new Error("Record not found");
    },
    updateRawMaterial: async (_, { id, input }) => {
      let record = await RawMaterial.findByPk(id);
      if (record) {
        const [updatedRowsCount] = await RawMaterial.update(input, {
          where: { id },
        });
        record = await RawMaterial.findByPk(id);
        return record;
      }
      throw new Error("Record not found");
    },
    updateProductQA: async (_, { id, input }) => {
      let record = await ProductQualityInspection.findByPk(id);
      if (record) {
        const [updatedRowsCount] = await ProductQualityInspection.update(
          input,
          {
            where: { id },
          }
        );
        record = await ProductQualityInspection.findByPk(id);
        return record;
      }
      throw new Error("Record not found");
    },
    createRawMaterial: async (_, { input }) => {
      return await RawMaterial.create(input);
    },
    createProduct: async (_, { input }) => {
      return await Product.create(input);
    },
    createProductQA: async (_, { input }) => {
      return await ProductQualityInspection.create(input);
    },
    deleteRawMaterial: async (_, { id }) => {
      const deletedRowsCount = await RawMaterial.destroy({
        where: { id },
      });

      if (deletedRowsCount === 0) {
        throw new Error("Record not found");
      }

      return { success: true, message: "Record deleted successfully" };
    },
    deleteProduct: async (_, { id }) => {
      const deletedRowsCount = await Product.destroy({
        where: { id },
      });

      if (deletedRowsCount === 0) {
        throw new Error("Record not found");
      }

      return { success: true, message: "Record deleted successfully" };
    },
    deleteProductQA: async (_, { id }) => {
      const deletedRowsCount = await ProductQualityInspection.destroy({
        where: { id },
      });

      if (deletedRowsCount === 0) {
        throw new Error("Record not found");
      }

      return { success: true, message: "Record deleted successfully" };
    },
  },
};

module.exports = resolvers;
