export const STUDENT_APIS = {
  register: "student/register",
  updateProfile: (studentId: string) => `student/update/${studentId}`,
  get: "student/get",
};

export const STAFF_APIS = {
  register: "staff/register",
  updateProfile: (staffId: string) => `staff/update/${staffId}`,
  getAllExpertiseAreas: "categories",
  get: "staff/get",
};

export const ADMIN_APIS = {
  get: "admin/get",
};

export const LOGIN_APIS = {
  login: "login",
  logout: "logout",
  verifyEmail: "verify-email",
  resendOTP: "resend-otp",
};
