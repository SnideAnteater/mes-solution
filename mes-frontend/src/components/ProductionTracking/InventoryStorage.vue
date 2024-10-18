<template>
  <div class="w-full bg-white p-6 rounded-lg shadow-md overflow-y-auto">
    <h3 class="text-xl font-semibold mb-4 text-left">Inventory</h3>

    <!-- Existing Raw Materials -->
    <table class="table-auto w-full text-left mb-6">
      <thead>
        <tr>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Supplier</th>
          <th class="px-4 py-2">Quantity Remaining</th>
          <th class="px-4 py-2">Quantity Used</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="material in rawMaterials" :key="material.id">
          <td class="border px-4 py-2">{{ material.name }}</td>
          <td class="border px-4 py-2">{{ material.supplier }}</td>
          <td class="border px-4 py-2">{{ material.quantityRemaining }}</td>
          <td class="border px-4 py-2">{{ material.quantityUsed }}</td>
          <td class="border px-4 py-2">
            <button
              @click="editRawMaterial(material)"
              class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2"
            >
              Edit
            </button>
            <button
              @click="deleteRawMaterial(material.id)"
              class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit Raw Material Form -->
    <h3 class="text-xl font-semibold mb-4 text-left">
      {{ isEditMode ? 'Edit' : 'Add New' }} Raw Material
    </h3>
    <form @submit.prevent="isEditMode ? updateRawMaterial() : addRawMaterial()">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1" for="name"
            >Material Name</label
          >
          <input
            v-model="newRawMaterial.name"
            type="text"
            id="name"
            class="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="supplier"
            >Supplier</label
          >
          <input
            v-model="newRawMaterial.supplier"
            type="text"
            id="supplier"
            class="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="quantityRemaining"
            >Quantity Remaining</label
          >
          <input
            v-model="newRawMaterial.quantityRemaining"
            type="number"
            id="quantityRemaining"
            class="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="quantityUsed"
            >Quantity Used</label
          >
          <input
            v-model="newRawMaterial.quantityUsed"
            type="number"
            id="quantityUsed"
            class="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {{ isEditMode ? 'Update Material' : 'Add Material' }}
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
      rawMaterials: [],
      newRawMaterial: {
        id: null, // For editing mode
        productId: null,
        name: '',
        supplier: '',
        quantityRemaining: 0,
        quantityUsed: 0,
      },
      isEditMode: false, // Flag for toggling between add/edit modes
    }
  },
  mounted() {
    this.fetchRawMaterials()
  },
  methods: {
    async fetchRawMaterials() {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
              query {
                getAllRawMaterial {
                  id
                  name
                  supplier
                  quantityRemaining
                  quantityUsed
                }
              }
            `,
        })
        this.rawMaterials = response.data.data.getAllRawMaterial
      } catch (error) {
        console.error('Error fetching raw materials:', error)
      }
    },
    async addRawMaterial() {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
              mutation($input: RawMaterialInput!) {
                createRawMaterial(input: $input) {
                  id
                  productId
                  name
                  supplier
                  quantityRemaining
                  quantityUsed
                }
              }
            `,
          variables: {
            input: {
              name: this.newRawMaterial.name,
              supplier: this.newRawMaterial.supplier,
              quantityRemaining: this.newRawMaterial.quantityRemaining,
              quantityUsed: this.newRawMaterial.quantityUsed,
            },
          },
        })

        const newMaterial = response.data.data.createRawMaterial
        this.rawMaterials.push(newMaterial)
        this.resetNewMaterialForm()
      } catch (error) {
        console.error('Error adding raw material:', error)
      }
    },
    async updateRawMaterial() {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `
              mutation($id: Int!, $input: RawMaterialInput!) {
                updateRawMaterial(id: $id, input: $input) {
                  id
                  productId
                  name
                  supplier
                  quantityRemaining
                  quantityUsed
                }
              }
            `,
          variables: {
            id: this.newRawMaterial.id,
            input: {
              name: this.newRawMaterial.name,
              supplier: this.newRawMaterial.supplier,
              quantityRemaining: this.newRawMaterial.quantityRemaining,
              quantityUsed: this.newRawMaterial.quantityUsed,
            },
          },
        })
        console.log(response)
        let updatedMaterial = response.data.data.updateRawMaterial
        let index = this.rawMaterials.filter(m => m.id === updatedMaterial.id)
        index[0].name = updatedMaterial.name
        index[0].supplier = updatedMaterial.supplier
        index[0].quantityRemaining = updatedMaterial.quantityRemaining
        index[0].quantityUsed = updatedMaterial.quantityUsed
        this.resetNewMaterialForm()
        this.isEditMode = false
      } catch (error) {
        console.error('Error updating raw material:', error)
      }
    },
    editRawMaterial(material) {
      this.newRawMaterial = { ...material } // Pre-fill the form with selected material
      this.isEditMode = true
    },
    cancelEdit() {
      this.resetNewMaterialForm()
      this.isEditMode = false
    },
    async deleteRawMaterial(id) {
      console.log(id)
      try {
        await axios.post('http://localhost:4000/graphql', {
          query: `
              mutation Mutation($deleteRawMaterialId: Int!) {
                deleteRawMaterial(id: $deleteRawMaterialId) {
                  success
                  message
                }
              }
            `,
          variables: {
            deleteRawMaterialId: id,
          },
        })

        this.rawMaterials = this.rawMaterials.filter(m => m.id !== id)
      } catch (error) {
        console.error('Error deleting raw material:', error)
      }
    },
    resetNewMaterialForm() {
      this.newRawMaterial = {
        id: null,
        name: '',
        supplier: '',
        quantityRemaining: 0,
        quantityUsed: 0,
      }
    },
  },
}
</script>
