export const STUDENT_APIS = {
  register: "student/register",
  updateProfile: (studentId: string) => `student/update/${studentId}`,
};

export const STAFF_APIS = {
  register: "staff/register",
  updateProfile: (staffId: string) => `staff/update/${staffId}`,
  getAllExpertiseAreas: "categories",
};

export const LOGIN_APIS = {
  login: "login",
  logout: "logout",
};
