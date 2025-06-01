import { adminRoutes } from "./routeConfig";
import { generateRoutes } from "../utils/routeGenerator";

export function useAdminRoutes() {
  return generateRoutes(adminRoutes);
}
