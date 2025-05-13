<template>
    <v-container>
        <v-row class="justify-center">
            <v-col cols="12">
                <h1 class="text-primary font-weight-bold text-center" style="margin-top: 10px ;">X-ray Report</h1>
            </v-col>
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
                    <div class="text-body-2" v-html="diagnosisText"></div>
                    <div class="d-flex justify-end mt-4">
                        <template v-if="orderSrc?.order?.status !== 'completed'">
                            <v-btn color="primary" class="text-white mr-2" @click="acceptReport">Accept</v-btn>
                            <v-btn variant="outlined" color="primary" class="mr-2" @click="modifyReport">Modify</v-btn>
                            <v-btn variant="outlined" color="primary" @click="rejectReport">Reject</v-btn>
                        </template>
                        <template v-else>
                            <v-btn color="primary" class="text-white mr-2" @click="exportPDF">View full radiology
                                report</v-btn>
                            <v-btn variant="outlined" color="primary" class="mr-2" :disabled="true">Notify
                                Patient</v-btn>
                            <v-btn variant="outlined" color="primary" @click="goBack">Back</v-btn>
                        </template>
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
import { useLabReports } from '@/useLabReports'

const route = useRoute()
const router = useRouter()

const { reports } = useLabReports()
const orderSrc = ref(null)
const patient = ref(null)
const diagnosisText = ref('')
const prediction = ref(null)

const aiDiagnosisMap = {
    Normal: [
        "No abnormal findings detected in the joint space.",
        "Joint alignment and spacing appear normal.",
        "No signs of degeneration or bony changes."
    ],
    Doubtful: [
        "Very subtle irregularities may be present in the joint surface.",
        "Slight suspicion of early cartilage changes.",
        "Findings are inconclusive; clinical correlation is advised."
    ],
    Mild: [
        "Early joint space narrowing detected, primarily medially.",
        "Small osteophyte formation may be present.",
        "Mild subchondral sclerosis observed."
    ],
    Moderate: [
        "Moderate joint space narrowing noted, especially in the weight-bearing regions.",
        "Visible osteophytes at joint margins.",
        "Subchondral sclerosis and bone remodeling observed."
    ],
    Severe: [
        "Severe joint space narrowing and deformity detected.",
        "Large osteophytes and advanced subchondral sclerosis present.",
        "Possible bone-on-bone contact and joint misalignment."
    ]
}

function getRandomPrediction() {
    const classes = ['Normal', 'Doubtful', 'Mild', 'Moderate', 'Severe']
    const randomClass = classes[Math.floor(Math.random() * classes.length)]
    const randomConfidence = (Math.random() * 0.4 + 0.6).toFixed(3) // 0.6 to 1.0
    return {
        class: randomClass,
        confidence: parseFloat(randomConfidence)
    }
}

function generateDiagnosis(predictionObj) {
    if (!predictionObj || !aiDiagnosisMap[predictionObj.class]) return

    const confidenceStr = (predictionObj.confidence * 100).toFixed(1)
    const lines = aiDiagnosisMap[predictionObj.class]

    diagnosisText.value =
        `• AI model detected **${predictionObj.class} osteoarthritis** with ${confidenceStr}% confidence.<br>` +
        lines.map(l => `• ${l}`).join('<br>')

    console.log("Generated diagnosisText:", diagnosisText.value)
}

onMounted(() => {
    const id = parseInt(route.params.id)
    orderSrc.value = reports.value.find(p => p.orderId === id)

    if (orderSrc.value) {
        patient.value = Patients.find(p => p.id === orderSrc.value.patientId)
        console.log("Loaded order:", orderSrc.value.order)

        const diagnosisRaw = orderSrc.value.order?.diagnosis
        console.log("diagnosisRaw:", diagnosisRaw)

        if (typeof diagnosisRaw !== 'string' || diagnosisRaw.trim() === '') {
            console.log("→ Generating new prediction")
            prediction.value = getRandomPrediction()
            generateDiagnosis(prediction.value)

            // Persist diagnosis back to the order
            orderSrc.value.order.diagnosis = diagnosisText.value
            orderSrc.value.order.prediction = prediction.value // optional
        } else {
            console.log("→ Using existing diagnosis")
            diagnosisText.value = diagnosisRaw
        }
    } else {
        console.warn('Lab report not found for orderId:', id)
    }
})

function acceptReport() {
    if (orderSrc.value) {
        orderSrc.value.order.diagnosis = diagnosisText.value
        router.push({ name: 'FinalReportPreview', params: { id: orderSrc.value.orderId } })
    }
}

function modifyReport() {
    if (orderSrc.value) {
        router.push({ name: 'EditDiagnosis', params: { id: orderSrc.value.orderId } })
    }
}

function rejectReport() {
    if (orderSrc.value) {
        router.push({ name: 'DiagnosisOverride', params: { id: orderSrc.value.orderId } })
    }
}

function exportPDF() {
    window.open('/Radiology_Report.pdf', '_blank');

}

function goBack() {
    router.back()
}
</script>
