<template>
  <v-card class="elevation-2 pa-4">
    <v-card-title class="text-primary font-weight-bold">
      <v-row class="w-100" justify="space-between" no-gutters>
        <!-- Title -->
        <v-col cols="12" md="4">
          <div>Lab Report Dashboard</div>
        </v-col>

        <!-- Search + Filter Button Side-by-Side -->
        <v-col cols="12" md="8">
          <div class="d-flex justify-end align-center gap-3">
            <v-text-field v-model="search" label="Search by Name or ID" variant="outlined" density="compact"
              hide-details clearable style="max-width: 300px; margin-right: 10px;" />

            <v-btn color="primary" variant="outlined" @click="showFilter = true">
              <v-icon start>mdi-filter-variant</v-icon>
              Filter
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-title>


    <v-data-table :items="filteredReports" :items-per-page="6" class="elevation-1" item-value="id">
      <!-- Header -->
      <template #headers>
        <tr>
          <th class="text-primary font-weight-bold">Patient ID</th>
          <th class="text-primary font-weight-bold">Name</th>
          <th class="text-primary font-weight-bold">Order Type</th>
          <th class="text-primary font-weight-bold">Body Part</th>
          <th class="text-primary font-weight-bold">Priority</th>
          <th class="text-primary font-weight-bold">Status</th>
        </tr>
      </template>

      <!-- Row -->
      <template #item="{ item }">
        <tr @click="goToReport(item)" class="hover-row">
          <td>{{ item.patientId }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.order.type }}</td>
          <td>{{ item.order.bodyPart }}</td>
          <td>{{ item.order.priority }}</td>
          <td><v-chip class="ma-1" :color="getStatusColor(item.order.status)" text-color="white" variant="elevated">
              {{ item.order.status.toUpperCase() }}
            </v-chip></td>
        </tr>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="showFilter" max-width="460">
    <v-card class="pa-4">
      <div class="text-h6 text-primary mb-4">Filter & Sort</div>

      <!-- Sort -->
      <v-select v-model="sortKey" :items="['Date', 'Name']" label="Sort by" variant="outlined" class="mb-4" />

      <!-- Priority (toggle style) -->
      <div class="mb-4">
        <div class="text-subtitle-2 mb-2">Priority</div>
        <v-btn-toggle v-model="filterPriority" mandatory>
          <v-btn value="All">All</v-btn>
          <v-btn value="Routine">Routine</v-btn>
          <v-btn value="Urgent">Urgent</v-btn>
        </v-btn-toggle>
      </div>

      <!-- Order Type -->
      <div class="mb-4">
        <div class="text-subtitle-2 mb-2">Order Type</div>
        <v-btn-toggle v-model="filterType" mandatory>
          <v-btn value="All">All</v-btn>
          <v-btn value="X-ray">X-ray</v-btn>
          <v-btn value="MRI">MRI</v-btn>
          <v-btn value="CT">CT</v-btn>
        </v-btn-toggle>
      </div>

      <!-- Order Status -->
      <div class="mb-4">
        <div class="text-subtitle-2 mb-2">Order Status</div>
        <v-btn-toggle v-model="filterStatus" mandatory>
          <v-btn value="All">All</v-btn>
          <v-btn value="Pending">Pending</v-btn>
          <v-btn value="Completed">Completed</v-btn>
          <v-btn value="Rejected">Rejected</v-btn>
        </v-btn-toggle>

      </div>

      <!-- Actions -->
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="resetFilters">Reset</v-btn>
        <v-btn color="primary" @click="showFilter = false">Show Results</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useLabReports } from '@/useLabReports'
import { Patients } from '@/assets/PatientData.js'

export default {
  name: 'LabReportHistory',
  data() {
    return {
      showFilter: false,
      sortKey: 'Date',
      filterPriority: 'All',
      filterType: 'All',
      filterStatus: 'All',
      search: '',
      enrichedReports: []
    }
  },
  created() {
    const labReports = useLabReports()

    // Get non-completed reports
    const activeReports = labReports.reports.value

    // Enrich with patient names
    this.enrichedReports = activeReports.map(report => {
      const match = Patients.find(p => p.id === report.patientId)
      return {
        ...report,
        name: match?.name || 'Unknown'
      }
    })
  },
  computed: {
    filteredReports() {
      const q = this.search.toLowerCase()

      let results = this.enrichedReports.filter(r =>
        r.name.toLowerCase().includes(q) || r.patientId.toString().includes(q)
      )

      // 🔍 Filter by Priority
      if (this.filterPriority !== 'All') {
        results = results.filter(r => r.order.priority === this.filterPriority)
      }

      // 🔍 Filter by Order Type
      if (this.filterType !== 'All') {
        results = results.filter(r => r.order.type === this.filterType)
      }

      // 🔍 Filter by Status
      if (this.filterStatus !== 'All') {
        results = results.filter(r => r.order.status === this.filterStatus.toLocaleLowerCase())
      }

      // 🔃 Sort
      if (this.sortKey === 'Name') {
        results.sort((a, b) => a.name.localeCompare(b.name))
      } else if (this.sortKey === 'Date') {
        results.sort((a, b) => {
          const d1 = new Date(a.orderDate.split('/').reverse().join('-'))
          const d2 = new Date(b.orderDate.split('/').reverse().join('-'))
          return d2 - d1
        })
      }

      return results
    }
  },
  methods: {
    resetFilters() {
      this.sortKey = 'Date'
      this.filterPriority = 'All'
      this.filterType = 'All'
      this.filterStatus = 'All'
    },
    goToReport(report) {
      this.$router.push({ name: 'LabReportDetail', params: { id: report.orderId } })
    },
    getStatusColor(status) {
      switch (status.toLowerCase()) {
        case 'pending':
          return '#FFC107'
        case 'completed':
          return '#00C853'
        case 'rejected':
          return '#FA3E05'
        default:
          return 'grey lighten-2'
      }
    }
  }
}
</script>

<style scoped>
.hover-row {
  cursor: pointer;
}

.hover-row:hover {
  background-color: #f9f9f9;
}
</style>