import { Route } from "react-router-dom";
import { RouteConfig } from "../types/routes";
import { RouteWrapper } from "../components/routes";

/**
 * Generates routes from a route configuration array
 * @param routes Array of route configurations
 * @returns Array of Route components
 */
export function generateRoutes(routes: RouteConfig[]) {
  return routes.map(({ path, component: Component, allowedRoles, title }) => (
    <Route
      key={path}
      path={path}
      element={
        <RouteWrapper
          allowedRoles={allowedRoles}
          title={title}
          requiresLayout={true}
        >
          <Component />
        </RouteWrapper>
      }
    />
  ));
}

/**
 * Generates routes without layout wrapper
 * @param routes Array of route configurations
 * @returns Array of Route components
 */
export function generateRoutesWithoutLayout(routes: RouteConfig[]) {
  return routes.map(({ path, component: Component, allowedRoles }) => (
    <Route
      key={path}
      path={path}
      element={
        <RouteWrapper allowedRoles={allowedRoles} requiresLayout={false}>
          <Component />
        </RouteWrapper>
      }
    />
  ));
}
