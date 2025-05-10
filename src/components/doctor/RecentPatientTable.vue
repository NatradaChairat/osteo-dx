<template>
  <v-card class="elevation-2 pa-4">
    <v-card-title class="text-h6 d-flex justify-space-between align-center text-primary font-weight-bold">
      Patients
      <v-text-field v-model="search" label="Search by ID or Name" variant="outlined" density="compact" hide-details
        clearable style="max-width: 300px" />
    </v-card-title>

    <v-data-table :items="filteredUsers" :items-per-page="6" class="elevation-1" item-value="id"
      @click:row="goToPatient">
      <!-- ✅ MANUAL HEADERS SLOT -->
      <template #headers>
        <tr>
          <th class="text-primary font-weight-bold">ID</th>
          <th class="text-primary font-weight-bold">Name</th>
          <th class="text-primary font-weight-bold">Gender</th>
          <th class="text-primary font-weight-bold">Age</th>
          <th class="text-primary font-weight-bold">Medical Conditions</th>
        </tr>
      </template>

      <!-- ✅ MANUAL ROW SLOT -->
      <template #item="{ item }">
        <tr @click="goToPatient(item)" class="hover-row">
          <td><span v-html="highlightMatch(item.id.toString())"></span></td>
          <td><span v-html="highlightMatch(item.name)"></span></td>
          <td>{{ item.gender }}</td>
          <td>{{ item.age }}</td>
          <td>{{ getLatestDiagnosis(item.diagnoses) }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { Patients } from "@/assets/PatientData";

export default {
  name: "RecentPatientTable",
  data() {
    return {
      search: "",
      users: [],
    };
  },
  created() {
    this.users = Patients;
  },
  computed: {
    filteredUsers() {
      const query = this.search.trim().toLowerCase();
      if (!query) return this.users.slice(0, 20);
      return this.users
        .filter(user =>
          user.name.toLowerCase().includes(query) ||
          user.id.toString().includes(query)
        )
        .slice(0, 20);
    },
  },
  methods: {
    highlightMatch(text) {
      if (!this.search) return text;
      const escaped = this.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      return text.toString().replace(regex, `<strong>$1</strong>`);
    },
    goToPatient(patient) {
      this.$router.push({ name: 'PatientDashboard', params: { id: patient.id } });
    },
    getLatestDiagnosis(diagnoses) {
      if (!diagnoses || diagnoses.length === 0) return "-";
      const latest = diagnoses.reduce((a, b) => (a.year > b.year ? a : b));
      return latest.label;
    }
  },
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
