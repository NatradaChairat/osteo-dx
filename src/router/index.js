import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/components/login/LoginPage.vue";
import SplashPage from "@/components/splash/SplashPage.vue";
import RecentPatient from "@/components/doctor/RecentPatientTable.vue";
import ReportHistory from "@/components/radiologist/ReportHistory.vue";

const routes = [
  {
    path: "/",
    name: "Splash",
    component: SplashPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/patients",
    name: "Patients",
    component: RecentPatient,
  },
  {
    path: "/patients/:id",
    name: "PatientDashboard",
    component: () => import("@/components/PatientDashboard.vue"),
    props: true,
  },
  {
    path: "/labReports",
    name: "LabReportHistory",
    component: ReportHistory,
  },
  {
    path: "/labReports/:id",
    name: "LabReportDetail",
    component: () => import("@/components/radiologist/LabReport.vue"),
    props: true,
  },
  {
    path: "/finalReportPreview/:id",
    name: "FinalReportPreview",
    component: () => import("@/components/radiologist/FinalReportPreview.vue"),
    props: true,
  },
  {
    path: "/editDisgnosis/:id",
    name: "EditDiagnosis",
    component: () => import("@/components/radiologist/EditDiagnosis.vue"),
    props: true,
  },
  {
    path: "/diagnosisOverride/:id",
    name: "DiagnosisOverride",
    component: () =>
      import("@/components/radiologist/DiagnosisOverrideView.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
