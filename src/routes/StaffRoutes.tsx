import { staffRoutes } from "./routeConfig";
import { generateRoutes } from "../utils/routeGenerator";

export function useStaffRoutes() {
  return generateRoutes(staffRoutes);
}
