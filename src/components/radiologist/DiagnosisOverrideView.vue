<template>
    <v-container>
        <!-- Page Title -->
        <v-row class="justify-center mb-6">
            <v-col cols="12">
                <h1 class="text-center text-primary font-weight-bold">Diagnosis Override</h1>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="10" lg="8">
                <!-- Reason for Rejection -->
                <v-card class="pa-6 mb-4" elevation="0" style="border-radius: 24px;">
                    <h3 class="text-primary font-weight-bold mb-2">Reason for rejection</h3>
                    <v-textarea v-model="reason" placeholder="Explain why the AI diagnosis was rejected" auto-grow
                        variant="outlined" :rules="[v => !!v || 'This field is required']" />
                </v-card>

                <!-- Optional Feedback -->
                <v-card class="pa-6 mb-4" elevation="0" style="border-radius: 24px;">
                    <h3 class="text-primary font-weight-bold mb-2">Feedback to AI (optional)</h3>
                    <v-textarea v-model="feedback" placeholder="Provide constructive feedback about the AI's result"
                        auto-grow variant="outlined" />
                </v-card>

                <!-- Action Buttons -->
                <div class="text-center mt-6">
                    <v-btn color="primary" class="text-white mr-4 px-6" @click="submitOverride">
                        Submit Feedback
                    </v-btn>
                    <v-btn variant="outlined" color="black" class="px-6" @click="cancel">
                        Cancel
                    </v-btn>
                </div>
            </v-col>
        </v-row>

        <!-- ✅ Feedback Dialog -->
        <v-dialog v-model="dialog" width="400" persistent>
            <v-card class="pa-6 text-center">
                <v-icon size="64" color="warning" class="mb-4">mdi-check-circle</v-icon>
                <h2 class="text-h6 font-weight-bold mb-2">Successful feedback submission</h2>
                <v-btn color="warning" class="mt-4 px-6" @click="closeDialog">Close</v-btn>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLabReports } from '@/useLabReports'
import { useAuth } from '@/auth'
const route = useRoute()

const { updateStatus } = useLabReports()
const { user } = useAuth()

const router = useRouter()
const reason = ref('')
const feedback = ref('')
const dialog = ref(false)

// Submit override logic
function submitOverride() {
    if (!reason.value.trim()) {
        alert('Please provide a reason for rejection.')
        return
    }

    const payload = {
        reason: reason.value,
        feedback: feedback.value || null,
        timestamp: new Date().toISOString(),
    }
    console.log('Override Submitted:', payload)

    const orderId = parseInt(route.params.id)
    const today = new Date().toLocaleDateString('en-GB')
    updateStatus(orderId, 'rejected', user.value.username, today)

    // Show dialog
    dialog.value = true
}

function closeDialog() {
    dialog.value = false
    router.push({ name: 'LabReportHistory' })
}

function cancel() {
    router.back()
}
</script>
