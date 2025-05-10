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

        <!-- Diagnosis -->
        <v-card class="pa-4 mb-6 rounded-lg">
            <div class="text-subtitle-1 font-weight-bold mb-2">Diagnosis</div>
            <ul class="text-body-2">
                <li v-for="(dx, i) in diagnosisList" :key="i">{{ dx }}</li>
            </ul>
            <div class="text-body-2 mt-2">{{ diagnosisSummary }}</div>
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
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Patients } from '@/assets/PatientData.js'
import { LabReports } from "@/assets/LabReport.js";

const route = useRoute()
const router = useRouter()

const orderSrc = ref(null)
const patient = ref(null)

onMounted(() => {
    const id = parseInt(route.params.id)
    orderSrc.value = LabReports.find(p => p.orderId === id)
    patient.value = Patients.find(p => p.id === orderSrc.value.patientId)
})


const clinicalHistory = ref(
    'Patient reports 3 months of progressive right knee pain without trauma. ' +
    'Symptoms include activity-related discomfort, occasional morning stiffness, and mild swelling. ' +
    'History of osteoarthritis in the opposite knee.'
)

const diagnosisList = ref([
    'Joint space narrowing, particularly in the medial compartment',
    'Subchondral sclerosis',
    'Osteophyte formation along the femoral and tibial margins',
    'Mild patellofemoral joint degeneration'
])

const diagnosisSummary = ref(
    'These findings are consistent with early to moderate osteoarthritis of the right knee.'
)

function submitToEHR() {
    console.log('Report submitted to EHR')
    // Your EHR submission logic here
    router.push('/labReports')
}

function cancel() {
    router.back()
}
</script>