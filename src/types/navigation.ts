import { IconType } from "react-icons";

export interface NavItem {
  name: string;
  icon: IconType;
  path: string;
  alert?: boolean;
}
