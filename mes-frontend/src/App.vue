<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-1/5 bg-blue-900 text-white flex flex-col justify-between">
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">Manufacturing Dashboard</h1>
        <nav class="space-y-4">
          <RouterLink
            to="/"
            class="block py-2 px-4 rounded hover:bg-blue-700"
            active-class="bg-blue-700"
            >Dashboard</RouterLink
          >
          <RouterLink
            to="/production-tracking"
            class="block py-2 px-4 rounded hover:bg-blue-700"
            active-class="bg-blue-700"
            >Production Tracking</RouterLink
          >
          <RouterLink
            to="/quality-control"
            class="block py-2 px-4 rounded hover:bg-blue-700"
            active-class="bg-blue-700"
            >Quality Control</RouterLink
          >
        </nav>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-8">
      <div
        class="bg-white p-6 rounded-lg shadow-md h-full aspect-w-16 aspect-h-9"
      >
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'

export default {
  components: {
    RouterView,
  },
}
</script>
