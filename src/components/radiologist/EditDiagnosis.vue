<template>
    <v-container>
        <!-- Centered Page Title -->
        <v-row class="justify-center">
            <v-col cols="12">
                <h1 class="text-primary font-weight-bold text-center" style="margin-top: 10px ;">Edit Diagnosis</h1>
            </v-col>
        </v-row>

        <v-row dense>
            <!-- Patient Info Card -->
            <v-col cols="12">
                <v-card class="pa-4" elevation="0">
                    <h3 class="font-weight-bold mb-2">Patient information</h3>
                    <div class="bg-gray-light pa-3" style="border-radius: 24px;">
                        <v-row dense>
                            <v-col cols="6">
                                <div class="font-weight-bold mb-1">Patient name</div>
                                <div>Jane Carson</div>
                                <div class="font-weight-bold mt-3 mb-1">Date of birth</div>
                                <div>07/22/1990 (35y 2m)</div>
                                <div class="font-weight-bold mt-3 mb-1">Referring physician</div>
                                <div>Dr James Smith</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="font-weight-bold mb-1">Sex</div>
                                <div>Female</div>
                                <div class="font-weight-bold mt-3 mb-1">NHS number</div>
                                <div>602 043 7669</div>
                            </v-col>
                        </v-row>
                    </div>
                </v-card>
            </v-col>

            <!-- Clinical History -->
            <v-col cols="12">
                <v-card class="pa-4" elevation="0">
                    <h3 class="font-weight-bold mb-2">Clinical history</h3>
                    <div class="bg-gray-light pa-3" style="border-radius: 24px;">
                        Patient reports 3 months of progressive right knee pain without trauma. Symptoms include
                        activity-related discomfort, occasional morning stiffness, and mild swelling. History of
                        osteoarthritis in the opposite knee.
                    </div>
                </v-card>
            </v-col>

            <!-- Edit Diagnosis -->
            <v-col cols="12">
                <v-card class="pa-4" elevation="0" style="border-radius: 24px;">
                    <div class="d-flex justify-space-between align-center mb-2">
                        <h3 class="text-primary font-weight-bold">Edit AI diagnosis</h3>
                        <v-icon color="primary" @click="toggleEditing" style="cursor: pointer;">
                            {{ isEditing ? 'mdi-check' : 'mdi-pencil' }}
                        </v-icon>
                    </div>

                    <v-textarea v-model="diagnosisText" label="AI Diagnosis" auto-grow readonly variant="outlined" />
                </v-card>
            </v-col>

            <!-- Buttons -->
            <v-col cols="12" class="text-center mt-2">
                <v-btn color="primary" class="text-white mr-4 px-6" @click="saveDiagnosis">
                    Save & Accept
                </v-btn>
                <v-btn variant="outlined" color="black" class="px-6" @click="cancelEdit">
                    Cancel
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Patients } from '@/assets/PatientData.js'
import { useLabReports } from '@/useLabReports'
import { useAuth } from '@/auth'
const { user } = useAuth()

const route = useRoute()
const router = useRouter()
const { reports, updateStatus } = useLabReports()

const isEditing = ref(false)
const patient = ref(null)
const orderSrc = ref(null)
const diagnosisText = ref('')

// ✅ Load existing diagnosis on mount
onMounted(() => {
    const orderId = parseInt(route.params.id)
    orderSrc.value = reports.value.find(r => r.orderId === orderId)

    if (orderSrc.value) {
        patient.value = Patients.find(p => p.id === orderSrc.value.patientId)
        diagnosisText.value = orderSrc.value.order.diagnosis || ''
    } else {
        console.warn('⚠️ Order not found for ID:', orderId)
    }
})

// Toggle between editable and readonly
function toggleEditing() {
    isEditing.value = !isEditing.value
}

// Save updated diagnosis back to the report
function saveDiagnosis() {
    if (orderSrc.value) {
        orderSrc.value.order.diagnosis = diagnosisText.value
        const today = new Date().toLocaleDateString('en-GB')
        updateStatus(orderSrc.value.orderId, 'completed', user.value.username, today)
        router.push('/labReports')
    }
}

// Cancel and go back
function cancelEdit() {
    router.back()
}
</script>


<style scoped></style>