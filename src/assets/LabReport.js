export const LabReports = [
  {
    orderId: 1,
    patientId: 1871504,
    orderDate: "10/03/2025",
    order: {
      type: "X-ray",
      bodyPart: "Right knee",
      reason: "Chronic right knee pain, suspected degenerative changes",
      priority: "Routine",
      status: "pending", // pending, completed, rejected
    },
  },
  {
    orderId: 2,
    patientId: 1159610,
    orderDate: "01/03/2025",
    order: {
      type: "MRI",
      bodyPart: "Spine",
      reason: "Chronic back pain with radiculopathy",
      priority: "Urgent",
      status: "pending",
    },
  },
];
