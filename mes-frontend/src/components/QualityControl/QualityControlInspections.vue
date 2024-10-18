<template>
  <div class="flex flex-col items-center h-full space-y-8">
    <h2 class="text-2xl font-bold mb-6">Product Quality Inspections</h2>

    <!-- Existing Product Quality Inspections -->
    <div class="w-full bg-white p-6 rounded-lg shadow-md overflow-y-auto">
      <h3 class="text-xl font-semibold mb-4 text-left">Inspection Records</h3>
      <table class="table-auto w-full text-left mb-6">
        <thead>
          <tr>
            <th class="px-4 py-2">Product Name</th>
            <th class="px-4 py-2">Inspection Time</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Pass</th>
            <th class="px-4 py-2">Defect</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inspection in inspections" :key="inspection.id">
            <td class="border px-4 py-2">{{ inspection.name }}</td>
            <td class="border px-4 py-2">
              {{ formatDate(inspection.inspectionTime) }}
            </td>
            <td class="border px-4 py-2">{{ inspection.status }}</td>
            <td class="border px-4 py-2">{{ inspection.productPass }}</td>
            <td class="border px-4 py-2">{{ inspection.productDefect }}</td>
            <td class="border px-4 py-2">
              <button
                @click="editInspection(inspection)"
                class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2 mb-2"
              >
                Edit
              </button>
              <button
                @click="deleteInspection(inspection.id)"
                class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Product Quality Inspection Form -->
    <div class="w-full bg-white p-6 rounded-lg shadow-md overflow-y-auto">
      <h3 class="text-xl font-semibold mb-4 text-left">
        {{ isEditMode ? 'Edit' : 'Add New' }} Product Quality Inspection
      </h3>
      <form @submit.prevent="isEditMode ? updateInspection() : addInspection()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- Select Product (Only Completed) -->
          <div>
            <label class="block text-sm font-medium mb-1" for="product"
              >Select Product</label
            >
            <select
              v-model="newInspection.name"
              id="product"
              class="w-full px-4 py-2 border rounded-md"
              required
            >
              <option
                v-for="product in completedProducts"
                :key="product.name"
                :value="product.name"
              >
                {{ product.name }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium mb-1" for="status"
              >Status</label
            >
            <input
              v-model="newInspection.status"
              type="text"
              id="status"
              class="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <!-- Product Pass -->
          <div>
            <label class="block text-sm font-medium mb-1" for="productPass"
              >Product Pass</label
            >
            <input
              v-model="newInspection.productPass"
              type="number"
              id="productPass"
              class="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <!-- Product Defect -->
          <div>
            <label class="block text-sm font-medium mb-1" for="productDefect"
              >Product Defect</label
            >
            <input
              v-model="newInspection.productDefect"
              type="number"
              id="productDefect"
              class="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <!-- Inspection Time -->
          <div>
            <label class="block text-sm font-medium mb-1" for="inspectionTime"
              >Inspection Time</label
            >
            <input
              v-model="newInspection.inspectionTime"
              type="datetime-local"
              id="inspectionTime"
              class="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {{ isEditMode ? 'Update Inspection' : 'Add Inspection' }}
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      inspections: [],
      completedProducts: [],
      newInspection: {
        id: null,
        name: '',
        productId: null,
        status: '',
        inspectionTime: '',
        productPass: 0,
        productDefect: 0,
      },
      isEditMode: false,
    }
  },
  mounted() {
    this.fetchInspections()
    this.fetchCompletedProducts()
  },
  methods: {
    async fetchInspections() {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            query {
              getAllProductQA {
                id
                productId
                name
                status
                inspectionTime
                productPass
                productDefect
              }
            }
          `,
        })
        this.inspections = response.data.data.getAllProductQA
        console.log(this.inspections)
      } catch (error) {
        console.error('Error fetching inspections:', error)
      }
    },
    async fetchCompletedProducts() {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            query {
              getAllProducts {
                id
                name
                productionStatus
              }
            }
          `,
        })
        // Filter products with productionStatus "Completed"
        this.completedProducts = response.data.data.getAllProducts.filter(
          product => product.productionStatus === 'Completed',
        )
      } catch (error) {
        console.error('Error fetching completed products:', error)
      }
    },
    async addInspection() {
      console.log(this.newInspection.name)
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            mutation($input: ProductQualityInspectionInput!) {
              createProductQA(input: $input) {
                id
                productId
                name
                status
                inspectionTime
                productPass
                productDefect
              }
            }
          `,
          variables: {
            input: {
              productId: this.newInspection.productId,
              status: this.newInspection.status,
              inspectionTime: this.newInspection.inspectionTime,
              productPass: this.newInspection.productPass,
              productDefect: this.newInspection.productDefect,
              name: this.newInspection.name,
            },
          },
        })
        const newInspection = response.data.data.createProductQA
        this.inspections.push(newInspection)
        this.resetNewInspectionForm()
      } catch (error) {
        console.error('Error adding inspection:', error)
      }
    },
    async updateInspection() {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
            mutation($id: Int!, $input: ProductQualityInspectionInput!) {
              updateProductQA(id: $id, input: $input) {
                id
                productId
                name
                status
                inspectionTime
                productPass
                productDefect
              }
            }
          `,
          variables: {
            id: this.newInspection.id,
            input: {
              productId: this.newInspection.productId,
              status: this.newInspection.status,
              inspectionTime: this.newInspection.inspectionTime,
              productPass: this.newInspection.productPass,
              productDefect: this.newInspection.productDefect,
            },
          },
        })
        const updatedInspection = response.data.data.updateProductQA
        const index = this.inspections.findIndex(
          i => i.id === updatedInspection.id,
        )
        if (index !== -1) {
          this.$set(this.inspections, index, updatedInspection) // Update reactivity
        }
        this.resetNewInspectionForm()
        this.isEditMode = false
      } catch (error) {
        console.error('Error updating inspection:', error)
      }
    },
    editInspection(inspection) {
      this.newInspection = { ...inspection } // Pre-fill form with inspection details
      this.isEditMode = true
    },
    cancelEdit() {
      this.resetNewInspectionForm()
      this.isEditMode = false
    },
    resetNewInspectionForm() {
      this.newInspection = {
        id: null,
        productId: '',
        status: '',
        inspectionTime: '',
        productPass: 0,
        productDefect: 0,
      }
    },
    async deleteInspection(id) {
      try {
        await axios.post('http://localhost:4000/graphql', {
          query: `
            mutation($id: Int!) {
              deleteProductQA(id: $id) {
                success
                message
              }
            }
          `,
          variables: { id },
        })
        this.inspections = this.inspections.filter(
          inspection => inspection.id !== id,
        )
      } catch (error) {
        console.error('Error deleting inspection:', error)
      }
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
  },
}
</script>
