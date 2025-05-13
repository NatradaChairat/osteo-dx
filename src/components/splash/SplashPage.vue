<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-primary" style="height: 100vh;">
      <div class="text-center">
        <h1 class="text-h4 font-weight-bold text-white">
          Welcome to <span class="text-black">OsteoDx</span>
        </h1>
        <p class="text-white">
          Your AI- Powered Diagnostic Tool for Orthopaedics
        </p>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/auth.js'

const router = useRouter()
const { user } = useAuth()

onMounted(() => {
  setTimeout(() => {
    if (user.value.role === 'doctor') {
      router.push('/patients')
    } else if (user.value.role === 'radiologist') {
      router.push('/labReports')
    } else {
      router.push('/login')
    }
  }, 3000)
})
</script>