import { studentRoutes } from "./routeConfig";
import { generateRoutes } from "../utils/routeGenerator";

export function useStudentRoutes() {
  return generateRoutes(studentRoutes);
}
