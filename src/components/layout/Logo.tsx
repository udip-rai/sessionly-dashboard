import { clsx } from "clsx";

export const Logo = ({
  className = "",
  ...props
}: { className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx("relative w-56 h-20 max-h-20 p-0 m-0", className)}>
      {" "}
      <img
        src="/src/assets/images/sessionly-logo.png"
        alt="Sessionly Logo"
        className="object-cover w-full h-full"
        {...props}
      />
    </div>
  );
};
