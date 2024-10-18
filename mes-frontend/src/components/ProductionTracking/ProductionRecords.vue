<template>
  <div class="flex flex-col items-center h-full space-y-8">
    <h2 class="text-2xl font-bold mb-6">Production Records</h2>

    <!-- Inventory Section -->
    <InventoryStorage></InventoryStorage>
    <ProductManagement></ProductManagement>
  </div>
</template>

<script>
import InventoryStorage from './InventoryStorage.vue'
import ProductManagement from './ProductManagement.vue'

export default {
  components: {
    InventoryStorage,
    ProductManagement,
  },
}
</script>
