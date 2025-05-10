// src/composables/useAuth.js
import { ref } from "vue";

const user = ref(getStoredUser());

function getStoredUser() {
  try {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : { username: "Guest", role: "guest" };
  } catch {
    return { username: "Guest", role: "guest" };
  }
}

function loginUser(newUser) {
  sessionStorage.setItem("user", JSON.stringify(newUser));
  user.value = newUser;
}

function logoutUser() {
  sessionStorage.clear();
  user.value = { username: "Guest", role: "guest" };
}

export function useAuth() {
  return { user, loginUser, logoutUser };
}
