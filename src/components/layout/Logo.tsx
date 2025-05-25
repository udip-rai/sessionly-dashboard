import { clsx } from "clsx";
import { assets } from "../../constants/assets";

export const Logo = ({
  className = "",
  ...props
}: { className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx("relative w-56 h-20 max-h-20 p-0 m-0", className)}>
      <img
        src={assets.logo}
        alt="Sessionly Logo"
        className="object-cover w-full h-full"
        {...props}
      />
    </div>
  );
};
