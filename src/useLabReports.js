// src/useLabReports.js
import { ref, watch } from "vue";

const stored = localStorage.getItem("labReports");
const reports = ref(stored ? JSON.parse(stored) : []);

// ✅ Auto-save any changes to localStorage
watch(
  reports,
  (newVal) => {
    localStorage.setItem("labReports", JSON.stringify(newVal));
  },
  { deep: true }
);

function addOrUpdateReport(report) {
  const index = reports.value.findIndex((r) => r.orderId === report.orderId);
  if (index !== -1) {
    reports.value[index] = report; // Overwrite
  } else {
    reports.value.push(report);
  }
}

function updateStatus(orderId, status, radiologistName, reportedDate) {
  const report = reports.value.find((r) => r.orderId === orderId);
  if (report) {
    report.order.status = status;
    report.order.radiologistName = radiologistName;
    report.order.reportedDate = reportedDate;
  }
}

function getReportsByStatus(status) {
  return reports.value.filter((r) => r.order.status === status);
}

function getReportByOrderId(orderId) {
  return reports.value.find((r) => r.orderId === orderId);
}

export function useLabReports() {
  return {
    reports,
    addOrUpdateReport,
    updateStatus,
    getReportsByStatus,
    getReportByOrderId,
  };
}
