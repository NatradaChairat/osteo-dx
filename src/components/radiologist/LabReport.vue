<template>
    <v-container>
        <v-row class="justify-space-between align-center mb-6">
            <h1 class="text-primary font-weight-bold" style="margin-top: 10px ;">X-ray Report</h1>
        </v-row>

        <v-row>
            <!-- Left: X-ray images -->
            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="6" v-for="n in 4" :key="n">
                        <v-img :src="`/xray/OP${n}.JPEG`" :alt="`Image ${n}`" class="mb-2" aspect-ratio="1" cover />
                        <div class="text-caption">Image {{ n }}</div>
                    </v-col>
                </v-row>
                <div class="mt-4">
                    <div v-if="orderSrc">
                        <strong>Document type:</strong> {{ orderSrc.order.type }}
                    </div>
                    <div v-if="orderSrc"><strong>Imaging date:</strong> {{ orderSrc.orderDate }}</div>
                </div>
            </v-col>

            <!-- Right: Report content -->
            <v-col cols="12" md="6">
                <!-- Patient Info -->
                <v-card class="pa-4 mb-4" v-if="patient">
                    <div class="text-subtitle-1 font-weight-medium mb-2">Patient information</div>
                    <v-row>
                        <v-col cols="6">
                            <div><strong>Patient name</strong><br />{{ patient.name }}</div>
                            <div class="mt-2"><strong>Age</strong><br />{{ patient.age || '—' }}</div>
                            <div class="mt-2"><strong>Referring physician</strong><br />Dr. James Smith</div>
                        </v-col>
                        <v-col cols="6">
                            <div><strong>Sex</strong><br />{{ patient.gender }}</div>
                            <div class="mt-2"><strong>NHS number</strong><br />{{ patient.nhsNumber }}</div>
                        </v-col>
                    </v-row>
                </v-card>

                <!-- Clinical history -->
                <v-card class="pa-4 mb-4">
                    <div class="text-subtitle-1 font-weight-medium mb-2">Clinical history</div>
                    <div class="text-body-2">
                        Patient reports 3 months of progressive right knee pain without trauma. Symptoms include
                        activity-related
                        discomfort, occasional morning stiffness, and mild swelling. History of osteoarthritis in the
                        opposite knee.
                    </div>
                </v-card>

                <!-- Technique -->
                <v-card class="pa-4 mb-4">
                    <div class="text-subtitle-1 font-weight-medium mb-2">Technique</div>
                    <div class="text-body-2">
                        Image 1: AP View – knee extended, supine position.<br />
                        Image 2: Lateral View – knee flexed ∼30°, lateral decubitus.<br />
                        Image 3: Sunrise View – axial view of patellofemoral joint, knee flexed.<br />
                        Image 4: Rosenberg View – PA weight-bearing, knees flexed 45°.
                    </div>
                </v-card>

                <!-- AI Diagnosis -->
                <v-card class="pa-4 mb-4">
                    <div class="text-subtitle-1 font-weight-medium mb-2">AI diagnosis</div>
                    <ul class="text-body-2">
                        <li>Joint space narrowing, particularly in the medial compartment</li>
                        <li>Subchondral sclerosis</li>
                        <li>Osteophyte formation along the femoral and tibial margins</li>
                        <li>Mild patellofemoral joint degeneration</li>
                    </ul>
                    <p class="text-body-2 mt-2">
                        These findings are consistent with early to moderate osteoarthritis of the right knee.
                    </p>

                    <div class="d-flex justify-end mt-4">
                        <v-btn color="primary" class="text-white mr-2" @click="acceptReport">Accept</v-btn>
                        <v-btn variant="outlined" color="primary" class="mr-2" @click="modifyReport">Modify</v-btn>
                        <v-btn variant="outlined" color="primary" @click="rejectReport">Reject</v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
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

// Actions
function acceptReport() {
    router.push({ name: 'FinalReportPreview', params: { id: orderSrc.value.orderId } })
}
function modifyReport() {
    console.log("Modify report requested.")
}
function rejectReport() {
    console.log("Report rejected.")
}
</script>
