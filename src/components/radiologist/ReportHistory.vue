<template>
  <v-card class="elevation-2 pa-4">
    <v-card-title class="text-primary font-weight-bold">
      <v-row class="w-100" align="center" justify="space-between" no-gutters>
        <!-- Title -->
        <v-col cols="12" md="4">
          <div>Lab Report List</div>
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
          <th class="text-primary font-weight-bold">Date Ordered</th>
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
          <td>{{ item.orderDate }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="showFilter" max-width="400">
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

      <!-- Actions -->
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="resetFilters">Reset</v-btn>
        <v-btn color="primary" @click="showFilter = false">Show Results</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { LabReports } from "@/assets/LabReport.js";
import { Patients } from "@/assets/PatientData.js";

export default {
  name: 'LabReportHistory',
  data() {
    return {
      showFilter: false,
      sortKey: 'Date',
      filterPriority: 'All',
      filterType: 'All',
      search: '',
      enrichedReports: []
    };
  },
  created() {
    this.enrichedReports = LabReports.map(report => {
      const match = Patients.find(p => p.id === report.patientId);
      return {
        ...report,
        name: match?.name || 'Unknown',
      };
    });
  },
  computed: {
    filteredReports() {
      const q = this.search.toLowerCase();

      let results = this.enrichedReports.filter(r =>
        r.name.toLowerCase().includes(q) || r.patientId.toString().includes(q)
      );

      // 🔍 Filter by Priority
      if (this.filterPriority !== 'All') {
        results = results.filter(r => r.order.priority === this.filterPriority);
      }

      // 🔍 Filter by Order Type
      if (this.filterType !== 'All') {
        results = results.filter(r => r.order.type === this.filterType);
      }

      // 🔃 Sort
      if (this.sortKey === 'Name') {
        results.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortKey === 'Date') {
        results.sort((a, b) => {
          const d1 = new Date(a.orderDate.split('/').reverse().join('-'));
          const d2 = new Date(b.orderDate.split('/').reverse().join('-'));
          return d2 - d1;
        });
      }

      return results;
    }

  },
  methods: {
    resetFilters() {
      this.sortKey = 'Date'
      this.filterPriority = 'All'
      this.filterType = 'All'
    },
    goToReport(report) {
      this.$router.push({ name: 'LabReportDetail', params: { id: report.orderId } });
    },
  }
};
</script>

<style scoped>
.hover-row {
  cursor: pointer;
}

.hover-row:hover {
  background-color: #f9f9f9;
}
</style>