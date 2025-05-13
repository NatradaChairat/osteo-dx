<template>
    <v-container class="py-10">
        <h1 class="text-center text-h5 font-weight-bold text-primary mb-8">Final Report Preview</h1>

        <!-- Patient Info -->
        <v-card class="pa-4 mb-6 rounded-lg" v-if="patient">
            <div class="text-subtitle-1 font-weight-bold mb-4">Patient information</div>
            <v-row>
                <v-col cols="6">
                    <div><strong>Patient name</strong><br />{{ patient.name }}</div>
                    <div class="mt-3"><strong>Age</strong><br />{{ patient.age }}</div>
                    <div class="mt-3"><strong>Referring physician</strong><br />Dr. James Smith</div>
                </v-col>
                <v-col cols="6">
                    <div><strong>Sex</strong><br />{{ patient.gender }}</div>
                    <div class="mt-3"><strong>NHS number</strong><br />{{ patient.nhsNumber }}</div>
                </v-col>
            </v-row>
        </v-card>

        <!-- Clinical History -->
        <v-card class="pa-4 mb-6 rounded-lg">
            <div class="text-subtitle-1 font-weight-bold mb-2">Clinical history</div>
            <div class="text-body-2">{{ clinicalHistory }}</div>
        </v-card>

        <!-- AI Diagnosis -->
        <v-card class="pa-4 mb-6 rounded-lg" v-if="orderSrc?.order?.diagnosis">
            <div class="text-subtitle-1 font-weight-bold mb-2">AI Diagnosis</div>
            <div class="text-body-2" v-html="formattedDiagnosis" />
        </v-card>

        <!-- Action Buttons -->
        <div class="d-flex justify-center mt-8">
            <v-btn color="primary" class="text-white mr-4 px-8" @click="submitToEHR">
                Submit to EHR
            </v-btn>
            <v-btn variant="outlined" color="black" class="px-8" @click="cancel">
                Cancel
            </v-btn>
        </div>
    </v-container>
</template>


<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Patients } from '@/assets/PatientData.js'
import { useLabReports } from '@/useLabReports'
import { useAuth } from '@/auth'
const { user } = useAuth()

const route = useRoute()
const router = useRouter()
const { reports, updateStatus } = useLabReports()

const orderSrc = ref(null)
const patient = ref(null)

onMounted(() => {
    const id = parseInt(route.params.id)
    orderSrc.value = reports.value.find(p => p.orderId === id)

    if (orderSrc.value) {
        patient.value = Patients.find(p => p.id === orderSrc.value.patientId)
    } else {
        console.warn('⚠️ Report not found for orderId:', id)
    }
})

// Clinical history (can remain static or be loaded from report if dynamic)
const clinicalHistory = ref(
    'Patient reports 3 months of progressive right knee pain without trauma. ' +
    'Symptoms include activity-related discomfort, occasional morning stiffness, and mild swelling. ' +
    'History of osteoarthritis in the opposite knee.'
)

// Render formatted diagnosis from saved data
const formattedDiagnosis = computed(() => {
    const raw = orderSrc.value?.order?.diagnosis
    return raw ? raw : ''
})

// Save status and route
function submitToEHR() {
    if (orderSrc.value) {
        const today = new Date().toLocaleDateString('en-GB')
        updateStatus(orderSrc.value.orderId, 'completed', user.value.username, today)
        router.push('/labReports')
    }
}

function cancel() {
    router.back()
}
</script>