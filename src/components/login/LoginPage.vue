<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grayLight" style="height: 100vh;">
      <v-container class="text-center">
        <h1 class="text-h5 font-weight-bold">
          Welcome to <span class="text-primary">Osteo</span><span class="text-black">Dx</span>
        </h1>
        <p>
          Your <span class="text-primary">AI-</span> Powered Diagnostic Tool for
          <span class="text-primary">Orthopaedics</span>
        </p>

        <v-card class="mx-auto mt-6 pa-6 border-primary" elevation="0" color="transparent"
          style="border-width: 2px; border-style: solid; border-radius: 12px; max-width: 400px;">
          <h3 class="text-h6 mb-4">Login</h3>
          <form @submit.prevent="handleLog">
            <v-text-field v-model="username" label="Enter your username" variant="outlined" density="comfortable"
              required hide-details class="mb-3" />
            <v-select v-model="role" :items="['doctor', 'radiologist']" label="Select your role" variant="outlined"
              density="comfortable" class="mb-3" required />
            <v-text-field v-model="password" label="Enter your password" type="password" variant="outlined"
              density="comfortable" required hide-details class="mb-3" />
            <div class="text-right mb-3 text-caption">
              <a href="#" class="text-decoration-none">Forgot password?</a>
            </div>
            <v-btn type="submit" block color="primary" class="white--text" height="45">
              Login
            </v-btn>
          </form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/auth.js'

const router = useRouter()
const { loginUser } = useAuth()

// form data
const username = ref('')
const password = ref('')
const role = ref('doctor') // default role

function handleLog() {
  loginUser({
    username: username.value,
    role: role.value
  })
  router.push(role.value === 'doctor' ? '/doctor' : '/radiologist')
}
</script>

<style>
.border-primary {
  border-color: #E0006D !important;
}

.bg-grayLight {
  background-color: #F2EEEE !important;
}
</style>
