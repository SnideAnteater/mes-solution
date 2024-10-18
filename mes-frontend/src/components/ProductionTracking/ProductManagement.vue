<template>
  <!-- Products Section -->
  <div class="w-full bg-white p-6 rounded-lg shadow-md overflow-y-auto">
    <h3 class="text-xl font-semibold mb-4 text-left">Products</h3>

    <!-- Existing Products -->
    <table class="table-auto w-full text-left mb-6">
      <thead>
        <tr>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Production Status</th>
          <th class="px-4 py-2">Production Start Date</th>
          <th class="px-4 py-2">Estimated Production End Date</th>
          <th class="px-4 py-2">Materials Used</th>
          <th class="px-4 py-2">Products to Produce</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="border px-4 py-2">{{ product.name }}</td>
          <td class="border px-4 py-2">{{ product.productionStatus }}</td>
          <td class="border px-4 py-2">{{ formatDate(product.dateStart) }}</td>
          <td class="border px-4 py-2">{{ formatDate(product.dateEnd) }}</td>
          <td class="border px-4 py-2">
            <ul>
              <li
                v-for="material in product.materialUsed"
                :key="material.rawMaterialId"
              >
                {{ material.name }} - {{ material.quantityUsed }} units
              </li>
            </ul>
          </td>
          <td class="border px-4 py-2">{{ product.totalProduct }}</td>
          <td class="border px-4 py-2">
            <button
              @click="editProduct(product)"
              class="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2 mb-2"
            >
              Edit
            </button>
            <button
              @click="completedProduct(product)"
              :disabled="product.completed"
              class="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 mr-2 mb-2"
            >
              Production Completed
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit Product Form -->
    <h3 class="text-xl font-semibold mb-4 text-left">
      {{ isEditMode ? 'Edit' : 'Add New' }} Product
    </h3>
    <form @submit.prevent="isEditMode ? updateProduct() : addProduct()">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1" for="name"
            >Product Name</label
          >
          <input
            v-model="newProduct.name"
            type="text"
            id="name"
            class="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="productionStatus"
            >Production Status</label
          >
          <input
            v-model="newProduct.productionStatus"
            type="text"
            id="productionStatus"
            class="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="dateStart"
            >Production Start Date</label
          >
          <input
            v-model="newProduct.dateStart"
            type="datetime-local"
            id="dateStart"
            class="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="dateEnd"
            >Estimated Production End Date</label
          >
          <input
            v-model="newProduct.dateEnd"
            type="datetime-local"
            id="dateEnd"
            class="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1"
            >Total Product to Produce</label
          >
          <div class="flex items-center space-x-4 mb-2">
            <input
              type="number"
              v-model="newProduct.totalProduct"
              placeholder="Total"
              class="w-32 px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <!-- Raw Materials Section -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1"
            >Select Raw Materials</label
          >
          <div
            v-for="material in rawMaterials"
            :key="material.id"
            class="flex items-center space-x-4 mb-2"
          >
            <input
              type="checkbox"
              :value="material.id"
              v-model="selectedRawMaterials"
            />
            <label>
              {{ material.name }} (Available:
              {{ material.quantityRemaining }} units)
            </label>
            <input
              type="number"
              v-model="materialQuantities[material.id]"
              :disabled="!selectedRawMaterials.includes(material.id)"
              placeholder="Quantity to use"
              class="w-32 px-4 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {{ isEditMode ? 'Update Product' : 'Add Product' }}
      </button>
      <button
        v-if="isEditMode"
        @click="cancelEdit"
        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2"
      >
        Cancel
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      products: [],
      rawMaterials: [],
      newProduct: {
        id: null,
        name: '',
        productionStatus: '',
        dateStart: '', // Initialize dateStart
        dateEnd: '', // Initialize dateEnd
        materialUsed: [],
        totalProduct: null,
      },
      selectedRawMaterials: [],
      materialQuantities: {}, // Store the quantity to use for each raw material
      isEditMode: false,
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchRawMaterials()
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            query {
              getAllProducts {
                id
                name
                productionStatus
                dateStart
                dateEnd
                completed
                totalProduct
                materialUsed {
                  rawMaterialId
                  name
                  quantityUsed
                }
              }
            }
          `,
        })
        this.products = response.data.data.getAllProducts
        console.log(this.products)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async fetchRawMaterials() {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            query {
              getAllRawMaterial {
                id
                name
                quantityRemaining
              }
            }
          `,
        })
        this.rawMaterials = response.data.data.getAllRawMaterial
      } catch (error) {
        console.error('Error fetching raw materials:', error)
      }
    },
    async addProduct() {
      let selectedMaterials = []
      this.selectedRawMaterials.forEach(id => {
        let newEntry = {}
        newEntry.rawMaterialId = id
        newEntry.name = this.rawMaterials.filter(m => m.id === id)[0].name
        newEntry.quantityUsed = this.materialQuantities[id]
        selectedMaterials.push(newEntry)
      })
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            mutation($input: ProductInput!) {
              createProduct(input: $input) {
                id
                name
                productionStatus
                dateStart
                dateEnd
                totalProduct
                materialUsed {
                    name
                    rawMaterialId
                    quantityUsed
                }
              }
            }
          `,
          variables: {
            input: {
              name: this.newProduct.name,
              productionStatus: this.newProduct.productionStatus,
              dateStart: new Date(this.newProduct.dateStart), // Convert to timestamp
              dateEnd: new Date(this.newProduct.dateEnd), // Convert to timestamp
              totalProduct: this.newProduct.totalProduct,
              materialUsed: selectedMaterials,
            },
          },
        })

        const newProduct = response.data.data.createProduct
        this.products.push(newProduct)
        this.resetNewProductForm()
      } catch (error) {
        console.error('Error adding product:', error)
      }
    },
    async updateProduct() {
      let selectedMaterials = []
      this.selectedRawMaterials.forEach(id => {
        let newEntry = {}
        newEntry.rawMaterialId = id
        newEntry.name = this.rawMaterials.filter(m => m.id === id)[0].name
        newEntry.quantityUsed = this.materialQuantities[id]
        selectedMaterials.push(newEntry)
      })
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            mutation Mutation($input: ProductInput!, $updateProductId: Int!) {
              updateProduct(input: $input, id: $updateProductId) {
                id
                productId
                name
                productionStatus
                materialUsed {
                  rawMaterialId
                  name
                  quantityUsed
                }
                dateStart
                dateEnd
                completed
                totalProduct
              }
            }
          `,
          variables: {
            updateProductId: this.newProduct.id,
            input: {
              name: this.newProduct.name,
              productionStatus: this.newProduct.productionStatus,
              dateStart: new Date(this.newProduct.dateStart), // Convert to timestamp
              dateEnd: new Date(this.newProduct.dateEnd), // Convert to timestamp
              totalProduct: this.newProduct.totalProduct,
              materialUsed: selectedMaterials,
            },
          },
        })
        const updatedProduct = response.data.data.updateProduct
        const index = this.products.filter(p => p.id === updatedProduct.id)
        console.log(updatedProduct)
        console.log(index)
        index[0].name = updatedProduct.name
        index[0].productionStatus = updatedProduct.productionStatus
        index[0].dateStart = updatedProduct.dateStart
        index[0].dateEnd = updatedProduct.dateEnd
        index[0].materialUsed = updatedProduct.materialUsed
        index[0].totalProduct = updatedProduct.totalProduct
        this.resetNewProductForm()
        this.isEditMode = false
      } catch (error) {
        console.error('Error updating product:', error)
      }
    },
    editProduct(product) {
      this.newProduct = { ...product } // Pre-fill form with product details
      this.newProduct.dateStart = this.formatDateForInput(product.dateStart)
      this.newProduct.dateEnd = this.formatDateForInput(product.dateEnd)
      this.selectedRawMaterials = product.materialUsed.map(
        material => material.rawMaterialId,
      )
      product.materialUsed.forEach(material => {
        this.materialQuantities[material.rawMaterialId] = material.quantityUsed
      })
      this.isEditMode = true
    },
    cancelEdit() {
      this.resetNewProductForm()
      this.isEditMode = false
    },
    async deleteProduct(id) {
      console.log(id)
      try {
        await axios.post('http://localhost:4000/graphql', {
          query: `
            mutation DeleteProductQA($deleteProductId: Int!) {
              deleteProduct(id: $deleteProductId) {
                message
                success
              }
            }
          `,
          variables: {
            deleteProductId: id,
          },
        })

        this.products = this.products.filter(product => product.id !== id)
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    },
    resetNewProductForm() {
      this.newProduct = {
        id: null,
        name: '',
        productionStatus: '',
        dateStart: '', // Reset dateStart
        dateEnd: '', // Reset dateEnd
        materialUsed: [],
      }
      this.selectedRawMaterials = []
      this.materialQuantities = {}
    },
    formatDate(timestamp) {
      if (!timestamp) return '' // Handle null or undefined
      const date = new Date(Number(timestamp)) // Convert string to number
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    formatDateForInput(timestamp) {
      if (!timestamp) return '' // Handle null or undefined
      const date = new Date(Number(timestamp))
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-based
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}`
    },
    async completedProduct(product) {
      console.log(product.id)
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            mutation Mutation($input: ProductInput!, $updateProductId: Int!) {
              updateProduct(input: $input, id: $updateProductId) {
                id
                completed
                productionStatus
              }
            }
          `,
          variables: {
            updateProductId: product.id,
            input: {
              completed: true,
              productionStatus: 'Completed',
            },
          },
        })
        const updatedProduct = response.data.data.updateProduct
        const index = this.products.filter(p => p.id === updatedProduct.id)
        console.log(updatedProduct)
        console.log(index)
        index[0].productionStatus = updatedProduct.productionStatus
      } catch (error) {
        console.error('Error updating product completion:', error)
      }
    },
  },
}
</script>
