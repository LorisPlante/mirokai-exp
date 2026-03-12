type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary" | "quinary" | "white";
  size?: "fit" | "full";
  type?: "button" | "submit" | "reset";
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "fit",
  type = "button",
}: ButtonProps) => {
  return (
    <button 
        className={`rounded-4xl px-5 py-2 text-md cursor-pointer flex items-center justify-center gap-2
          ${variant === "primary" ? "bg-primary text-white" 
              : variant === "secondary" ? "bg-secondary text-white" 
              : variant === "tertiary" ? "bg-tertiary text-white" 
              : variant === "quaternary" ? "bg-quaternary text-white" 
              : variant === "white" ? "bg-white text-foreground" 
              : "bg-quinary text-white"}
          ${size === "fit" ? "w-fit" : "w-full"}
        `} 
        type={type}
        onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;