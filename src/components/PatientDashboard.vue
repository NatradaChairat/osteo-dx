<template>
    <v-container>
        <h1 class="text-primary mb-6 align-center">Patient Overview Dashboard</h1>
        <div style="min-height: 100%; display: flex; flex-direction: column;">
            <v-row class="align-stretch" style="flex-grow: 1;">
                <!-- Left: Patient Info -->
                <v-col cols="12" md="4" class="d-flex flex-column">
                    <v-card class="pa-4">
                        <div class="d-flex justify-center">
                            <v-avatar size="100" class="mx-auto mb-3">
                                <v-img :src="avatarSrc" alt="Patient" />
                            </v-avatar>
                        </div>
                        <div class="text-center font-weight-bold text-h6">{{ patient.name }}</div>
                        <div class="text-center mb-2">({{ patient.gender }}, {{ patient.age }}y)</div>
                        <div class="text-center text-caption">NHS: {{ patient.nhsNumber }}</div>

                        <!-- Medical Diagnoses -->
                        <div class="font-weight-bold mb-2">Medical diagnoses</div>
                        <div v-for="(dx, i) in patient.diagnoses" :key="i" class="mb-1">
                            {{ dx.year }}
                            <v-chip class="ma-1" color="pink-lighten-5" text-color="primary" variant="elevated">
                                {{ dx.label }}
                            </v-chip>
                        </div>

                        <v-divider class="my-4" />

                        <!-- Drug Allergies -->
                        <div class="d-flex justify-space-between align-center mb-2">
                            <div class="font-weight-bold">Drug allergies</div>
                            <span class="text-primary font-weight-medium">+ Add</span>
                        </div>
                        <div>
                            <v-chip v-for="(drug, i) in patient.allergies" :key="i" class="ma-1" color="pink-lighten-5"
                                end size="small" text-color="primary" variant="elevated" append-icon="mdi-close">
                                {{ drug }}
                            </v-chip>
                        </div>

                        <v-divider class="my-4" />

                        <!-- Medications -->
                        <div class="font-weight-bold mb-2">Medications</div>
                        <div>
                            <v-chip v-for="(med, i) in patient.medications" :key="i" class="ma-1" color="pink-lighten-5"
                                end size="small" text-color="primary" variant="elevated">
                                {{ med }}
                            </v-chip>
                        </div>

                        <v-divider class="my-4" />

                        <!-- Smoking Status -->
                        <div class="d-flex justify-space-between align-center mb-2">
                            <div class="font-weight-bold">Smoking status</div>
                            <span class="text-primary font-weight-medium">+ Add</span>
                        </div>
                        <v-chip class="ma-1" color="pink-lighten-5" text-color="primary" variant="elevated" end
                            size="small" append-icon="mdi-close">
                            {{ patient.smokingStatus }}
                        </v-chip>

                        <v-divider class="my-4" />

                        <!-- Latest Vital Signs -->
                        <div class="font-weight-bold mb-2">Latest vital signs</div>
                        <v-row>
                            <v-col cols="6" v-for="(vital, key) in patient.vitals" :key="key">
                                <strong>{{ vital.label }}</strong><br />
                                <span class="text-grey-darken-2">{{ vital.value }}</span>
                            </v-col>
                        </v-row>

                    </v-card>
                </v-col>

                <template v-if="!showImagingOrder">
                    <!-- Middle: Details -->
                    <v-col cols="12" md="4" class="d-flex flex-column">

                        <!-- Middle: Clinical Summary -->
                        <v-card class="mb-4 pa-4 flex-grow-1 d-flex flex-column">
                            <div class="text-h6 font-weight-medium mb-2 text-primary">Encounter Summary</div>
                            <div>Last encounter: 01/03/2025</div>
                            <div>Reason: Right knee pain</div>
                            <div>GP: Dr. James Smith</div>
                        </v-card>

                        <!-- Recent Medications -->
                        <v-card class="pa-4 mb-4 flex-grow-1 d-flex flex-column">
                            <div class="text-h6 font-weight-medium mb-2 text-primary">Recent medications</div>
                            <div v-for="(item, i) in patient.recentMedications" :key="i"
                                class="d-flex justify-space-between mb-1">
                                <span class="text-body-2 text-gray-dark">{{ item.date }}</span>
                                <span class="text-body-1">{{ item.name }}</span>
                            </div>
                        </v-card>


                        <!-- Recent Investigations -->
                        <v-card class="pa-4 mb-4">
                            <div class="text-h6 font-weight-medium mb-2 text-primary">Recent investigations</div>
                            <div v-for="(item, i) in investigations" :key="i" class="mb-2">
                                <div class="d-flex justify-space-between align-start">
                                    <span class="text-body-2 text-gray-dark" style="margin-top: 2px;">{{ item.date
                                    }}</span>
                                    <div class="ml-2" style="width: 100%;">
                                        <div class="d-flex justify-space-between">
                                            <div>
                                                <div class="text-body-1 font-weight-medium">{{ item.name }}</div>
                                                <div class="text-caption">
                                                    Status:
                                                    <span :class="{
                                                        'text-primary font-weight-medium': item.status === 'completed',
                                                        'text-gray-dark': item.status === 'pending'
                                                    }">
                                                        {{ item.status }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div v-if="item.status === 'completed'"
                                                class="text-caption font-weight-medium text-primary"
                                                style="cursor: pointer;" @click="viewReport(item.orderId)">
                                                View report
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>

                    <!-- Right: Details -->
                    <v-col cols="12" md="4" class="d-flex flex-column">

                        <!-- Clinical concerns -->
                        <v-card class="pa-4 mb-4 flex-grow-1 d-flex flex-column">
                            <div class="text-h6 font-weight-medium mb-2 text-primary">Clinical concerns</div>

                            <!-- Show 'Current' first -->
                            <div v-if="groupedDiagnoses['Current']" class="d-flex mb-1">
                                <span class="text-body-2 text-gray-dark" style="min-width: 60px;">Current</span>
                                <div>
                                    <div v-for="(label, idx) in groupedDiagnoses['Current']" :key="'current-' + idx">
                                        {{ label }}
                                    </div>
                                </div>
                            </div>

                            <!-- Show other years descending -->
                            <div v-for="year in Object.keys(groupedDiagnoses).filter(y => y !== 'Current').sort((a, b) => Number(b) - Number(a))"
                                :key="year" class="d-flex mb-1">
                                <span class="text-body-2 text-gray-dark" style="min-width: 60px;">{{ year }}</span>
                                <div>
                                    <div v-for="(label, idx) in groupedDiagnoses[year]" :key="year + '-' + idx">
                                        {{ label }}
                                    </div>
                                </div>
                            </div>
                        </v-card>

                        <v-card class="mb-4 pa-4 flex-grow-1 d-flex flex-column">
                            <div class="text-h6 font-weight-medium mb-2 text-primary">Next Steps</div>
                            <v-btn block variant="outlined" color="primary" class="mb-2">Order lab test</v-btn>
                            <v-btn block variant="outlined" color="primary" class="mb-2"
                                @click="showImagingOrder = true">Order imaging</v-btn>
                            <v-btn block variant="outlined" color="primary" class="mb-2">Refer to specialist</v-btn>
                            <v-btn block variant="outlined" color="primary">Add clinical note</v-btn>
                        </v-card>

                    </v-col>
                </template>


                <template v-else>

                    <!-- Right: Nested layout -->
                    <v-col cols="12" md="8">
                        <v-row>
                            <!-- Clinical notes -->
                            <v-col cols="12" md="8">
                                <v-card class="pa-4">
                                    <div class="text-h6 font-weight-medium mb-2 text-primary">Clinical notes</div>
                                    <ul class="text-body-2" style="margin-left: 6px;">
                                        <li>Report worsening right knee pain for past 3 months</li>
                                        <li>Pain is aggravated by prolonged standing or walking</li>
                                        <li>No history of injury or recent trauma</li>
                                        <li>Exam reveals mild swelling and tenderness over medical joint line</li>
                                    </ul>
                                </v-card>
                            </v-col>

                            <!-- Latest encounter -->
                            <v-col cols="12" md="4">
                                <v-card class="pa-4">
                                    <div class="text-body-2 text-gray-dark">Latest encounter</div>
                                    <div class="text-body-1 mb-3">15/09/2025<br>Annual rev</div>

                                    <div class="text-body-2 text-gray-dark">Co-morbidities</div>
                                    <div class="text-body-1">Osteoarthritis</div>
                                </v-card>
                            </v-col>

                            <!-- Imaging Order: Full width under both above -->
                            <v-col cols="12">
                                <v-card class="pa-4">
                                    <div class="text-h6 font-weight-medium mb-4 text-primary">Imaging order</div>

                                    <v-select label="Type" :items="['X-ray', 'MRI', 'CT']" v-model="order.type"
                                        variant="outlined" />

                                    <v-text-field label="Body part" v-model="order.bodyPart" variant="outlined"
                                        class="mt-3" />

                                    <v-textarea label="Reason" v-model="order.reason" variant="outlined" rows="3"
                                        class="mt-3" />

                                    <div class="mt-3 mb-4">
                                        <span class="text-body-1 font-weight-medium mr-4">Priority</span>
                                        <v-radio-group v-model="order.priority" row>
                                            <v-radio label="Routine" value="Routine"></v-radio>
                                            <v-radio label="Urgent" value="Urgent"></v-radio>
                                        </v-radio-group>
                                    </div>

                                    <v-btn color="primary" class="text-white" block @click="sendImagingOrder">Send to
                                        Radiologist</v-btn>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </template>
            </v-row>
        </div>
    </v-container>

    <v-dialog v-model="showSuccessDialog" max-width="400">
        <v-card class="pa-6 text-center">
            <v-avatar size="100" class="mx-auto mb-4" color="primary">
                <v-icon size="56" color="white">mdi-check</v-icon>
            </v-avatar>

            <div class="text-h6 text-primary mb-4">Successful imaging order</div>

            <v-btn color="primary" class="text-white" @click="backToDashboard">
                Back to Patient Dashboard
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script>
import { Patients } from '@/assets/PatientData'
import femaleAvatar from '@/assets/face_female.jpg'
import maleAvatar from '@/assets/face_male.jpg'
import { useLabReports } from '@/useLabReports'

const labReports = useLabReports()

export default {
    props: ['id'],
    data() {
        return {
            patient: {},
            avatarSrc: {},
            showImagingOrder: false,
            showSuccessDialog: false,
            order: {
                type: 'X-ray',
                bodyPart: 'Right knee',
                reason: 'Chronic right knee pain, suspected degenerative changes',
                priority: 'Routine'
            },
            investigations: [
                {
                    date: '15/12/2024',
                    name: 'Blood test',
                    status: 'completed',
                    orderId: true
                }
            ]
        }
    },
    created() {
        this.patient = Patients.find(p => p.id.toString() === this.id)
        this.avatarSrc = this.patient.gender === 'Female' ? femaleAvatar : maleAvatar
        const patientReports = labReports.reports.value.filter(
            r => r.patientId === this.patient.id
        )
        const imagingInvestigations = patientReports.map(r => ({
            date: r.orderDate,
            name: `${r.order.bodyPart} ${r.order.type}`,
            status: r.order.status,
            orderId: r.orderId // used for "View report"
        }))
        this.investigations = [...imagingInvestigations, ...this.investigations]
    },
    methods: {
        sendImagingOrder() {
            const today = new Date().toLocaleDateString('en-GB') // dd/mm/yyyy
            const newInvestigation = {
                date: today,
                name: `${this.order.bodyPart} ${this.order.type}`,
                status: 'pending',
            }
            this.investigations.unshift(newInvestigation)
            const newReport = {
                orderId: Date.now(),
                patientId: this.patient.id,
                orderDate: today,
                order: {
                    type: `${this.order.type}`,
                    bodyPart: `${this.order.bodyPart}`,
                    reason: `${this.order.reason}`,
                    priority: `${this.order.priority}`,
                    status: 'pending',
                    diagnosis: null
                }
            }

            labReports.addOrUpdateReport(newReport)
            this.showSuccessDialog = true
        },
        backToDashboard() {
            this.showSuccessDialog = false
            this.showImagingOrder = false
        },
        viewReport(orderId) {
            this.$router.push({ name: 'LabReportDetail', params: { id: orderId } })
        }
    },
    computed: {
        groupedDiagnoses() {
            if (!this.patient.diagnoses || this.patient.diagnoses.length === 0) return {}

            const latestYear = Math.max(...this.patient.diagnoses.map(d => d.year))
            const grouped = {}

            // Step 1: Group diagnoses
            this.patient.diagnoses.forEach(d => {
                const groupKey = d.year === latestYear ? 'Current' : d.year.toString()
                if (!grouped[groupKey]) grouped[groupKey] = []
                grouped[groupKey].push(d.label)
            })

            // Step 2: Extract and sort keys
            const keys = Object.keys(grouped)
            const sortedKeys = keys
                .filter(k => k !== 'Current')
                .sort((a, b) => parseInt(b) - parseInt(a))

            // Step 3: Build new object
            const sorted = {}
            if (grouped['Current']) sorted['Current'] = grouped['Current']
            sortedKeys.forEach(k => {
                sorted[k] = grouped[k]
            })

            return sorted
        }
    },
}
</script>