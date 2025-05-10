<template>
  <v-app>
    <v-app-bar v-if="!isAuthPage" flat height="64" class="px-6 bg-white" elevation="3">
      <!-- Brand -->
      <v-toolbar-title class="text-h6 font-weight-bold">
        <span class="text-primary">Osteo</span><span class="text-black">DX</span>
      </v-toolbar-title>

      <!-- Inline Menu -->
      <v-spacer />
      <v-btn variant="text" to="/" class="text-button" color="black">Home</v-btn>
      <v-btn variant="text" to="/patients" class="text-button" color="black" v-if="user.role == 'doctor'">Patient
        Lists</v-btn>
      <v-btn variant="text" to="/labReports" class="text-button" color="black" v-if="user.role !== 'doctor'">Lab
        Reports</v-btn>
      <v-btn variant="text" to="/settings" class="text-button" color="black">Settings</v-btn>
      <v-btn variant="text" to="/help" class="text-button" color="black">Help</v-btn>
      <v-btn variant="text" @click="logout" class="text-button" color="black">Log-out</v-btn>

      <!-- User Avatar + Greeting -->
      <span class="ml-2 text-caption text-black">Hello, {{ user.username }}</span>
      <v-avatar class="ml-4" size="36">
        <v-img :src="avatarSrc" alt="User" />
      </v-avatar>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import doctorAvatar from '@/assets/doctor.png'
import radiologistAvatar from '@/assets/radiologist.png'
import { useAuth } from './auth.js'

const { user, logoutUser } = useAuth()
const router = useRouter()
const route = useRoute()

// Show different avatar per role
const avatarSrc = computed(() =>
  user.value.role === 'radiologist' ? radiologistAvatar : doctorAvatar
)

// Determine if login page
const isAuthPage = computed(() =>
  ['/login', '/'].includes(route.path)
)

// Logout handler
function logout() {
  logoutUser()
  router.push('/login')
}
</script>

<!-- <script setup>

import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import doctorAvatar from '@/assets/doctor.png'
import radiologistAvatar from '@/assets/radiologist.png'

const router = useRouter()
const route = useRoute()

const user = ref({
  username: 'Guest',
  role: 'doctor' // default role; can be 'doctor' or 'radiologist'
})

const avatarSrc = ref('')

onMounted(() => {
  const storedUser = JSON.parse(sessionStorage.getItem('user'))
  console.log("stored:" + storedUser.username)

  if (storedUser) {
    user.value = storedUser
    avatarSrc.value =
      storedUser.role === 'radiologist' ? radiologistAvatar : doctorAvatar
  } else {
    avatarSrc.value = doctorAvatar
  }
})

function logout() {
  sessionStorage.clear()
  router.push('/login')
}

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/'
})
</script> -->
