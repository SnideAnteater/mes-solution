<template>
  <div class="flex flex-col items-center justify-center h-full space-y-8">
    <h2 class="text-3xl font-bold mb-6">Manufacturing Dashboard</h2>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <!-- Machine Utilization Card -->
      <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <h3 class="text-lg font-semibold mb-4 text-center">
          Machine Utilization (%)
        </h3>
        <p class="text-2xl font-bold text-blue-500">
          {{ dashboardMetric[0]?.machineUtilization ?? '-' }}
        </p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <h3 class="text-lg font-semibold mb-4">Inspection In Progress</h3>
        <p class="text-2xl font-bold text-blue-500">
          {{ inspectionInProgress ?? '-' }}
        </p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <h3 class="text-lg font-semibold mb-4">Product In Production</h3>
        <p class="text-2xl font-bold text-blue-500">
          {{ productInProduction ?? '-' }}
        </p>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="w-full flex flex-row space-x-5">
      <div class="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-gray-700 mb-4">
          Inventory Storage
        </h3>
        <canvas id="rawMaterialChart"></canvas>
      </div>

      <div class="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-gray-700 mb-4">
          Product Status
        </h3>
        <canvas id="productChart"></canvas>
      </div>
    </div>
    <div class="w-full flex flex-row space-x-5">
      <div class="w-full bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-gray-700 mb-4">
          Latest Product Inspection
        </h3>
        <h3
          v-if="latestCompletedInspection"
          class="text-l font-semibold text-gray-700 mb-4"
        >
          Product: {{ latestCompletedInspection.name ?? 'Loading..' }}
        </h3>
        <h3
          v-if="latestCompletedInspection"
          class="text-l font-semibold text-gray-700 mb-4"
        >
          Defect Rate: {{ latestDefectRate ?? 'Loading..' }}
        </h3>
        <canvas id="latestProductInspection"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  components: {},
  data() {
    return {
      product: [],
      productQA: [],
      rawMaterial: [],
      dashboardMetric: [],
      inspectionInProgress: null,
      productInProduction: null,
      latestCompletedInspection: null,
      latestDefectRate: null,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
            query ExampleQuery {
              getAllProducts {
                id,
                name,
                productId,
                productionStatus,
                dateStart,
                dateEnd,
                completed,
                materialUsed {
                  name,
                  quantityUsed,
                  rawMaterialId
                }
                
              }
              getAllProductQA {
                id
                inspectionTime
                name
                productDefect
                productId
                productPass
                status
              }
              getDashboardMetrics {
                machineUtilization
              }
              getAllRawMaterial {
                id
                productId
                name
                supplier
                quantityRemaining
                quantityUsed
              }
            }
          `,
      })
      this.product = response.data.data.getAllProducts
      this.productQA = response.data.data.getAllProductQA
      this.rawMaterial = response.data.data.getAllRawMaterial
      this.dashboardMetric = response.data.data.getDashboardMetrics
      // console.log(this.product)
      // console.log(this.productQA)
      // console.log(this.rawMaterial)
      this.calculateInspectionInProgress()
      this.calculateProductInProduction()
      this.createRawMaterialChart()
      this.createProductChart()
      this.createProductQAChart()
    },
    calculateInspectionInProgress() {
      this.productQA.forEach(list => {
        if (list.status !== 'Completed') {
          if (this.inspectionInProgress === null) {
            this.inspectionInProgress = 0
          }
          this.inspectionInProgress++
        }
      })
    },
    calculateProductInProduction() {
      this.product.forEach(list => {
        if (!list.completed) {
          if (this.productInProduction === null) {
            this.productInProduction = 0
          }
          this.productInProduction++
        }
      })
    },
    createRawMaterialChart() {
      const labels = this.rawMaterial.map(material => material.name)
      const data = this.rawMaterial.map(material => material.quantityRemaining)
      new Chart(document.getElementById('rawMaterialChart'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Quantity',
              data: data,
              backgroundColor: 'pink',
              borderColor: 'red',
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Inventory Storage',
            },
          },
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    },
    createProductChart() {
      const completedCount = this.product.filter(
        product => product.completed,
      ).length
      const incompleteCount = this.product.length - completedCount

      new Chart(document.getElementById('productChart'), {
        type: 'pie',
        data: {
          labels: ['Completed', 'In Production'],
          datasets: [
            {
              label: 'Quantity',
              data: [completedCount, incompleteCount],
            },
          ],
        },
        options: {
          plugins: {},
        },
      })
    },
    createProductQAChart() {
      const completedInspections = this.productQA
        .filter(qa => qa.status === 'Completed') // Adjust based on your "completed" status
        .sort((a, b) => new Date(b.inspectionTime) - new Date(a.inspectionTime))
      // Get the latest completed inspection
      this.latestCompletedInspection = completedInspections[0] || null
      console.log(this.latestCompletedInspection)
      this.latestDefectRate =
        (this.latestCompletedInspection.productDefect /
          (this.latestCompletedInspection.productDefect +
            this.latestCompletedInspection.productPass)) *
        100
      new Chart(document.getElementById('latestProductInspection'), {
        type: 'bar',
        data: {
          labels: ['Defects', 'Pass'],
          datasets: [
            {
              label: 'Quantity',
              data: [
                this.latestCompletedInspection.productDefect,
                this.latestCompletedInspection.productPass,
              ],
              backgroundColor: 'skyblue',
              borderColor: 'blue',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    },
  },
}
</script>
