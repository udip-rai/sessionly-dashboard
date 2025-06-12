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
  deleteCertificate: (staffId: string, certificateIndex: number) =>
    `staff/certificates/${staffId}/${certificateIndex}`,
};

export const ADMIN_APIS = {
  get: "admin/get",
  getAllStudents: "admin/students/all",
  getAllStaff: "admin/staff/all",

  CONTENT: {
    faq: {
      create: "faq",
      get: "faq/published",
      delete: (id: string) => `faq/${id}`,
    },
    websiteStats: {
      create: "stat",
      get: "stat/published",
      delete: (id: string) => `stat/${id}`,
    },
  },
};

export const CATEGORY_APIS = {
  getAll: "categories/with-counts",
  create: "categories",
  update: (categoryId: string) => `categories/${categoryId}`,
  delete: (categoryId: string) => `categories/${categoryId}`,
  createSubcategory: (categoryId: string) =>
    `categories/${categoryId}/subcategories`,
  updateSubcategory: (categoryId: string, subcategoryId: string) =>
    `categories/${categoryId}/subcategories/${subcategoryId}`,
  deleteSubcategory: (categoryId: string, subcategoryId: string) =>
    `categories/${categoryId}/subcategories/${subcategoryId}`,
};

export const LOGIN_APIS = {
  login: "login",
  logout: "logout",
};
