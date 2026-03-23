import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        cta: "gradient-cta text-cta-foreground shadow-cta hover:opacity-90 active:scale-[0.98] font-bold",
        ctaOutline: "border-2 border-cta bg-transparent text-cta hover:bg-cta hover:text-cta-foreground font-bold",
        whatsapp: "bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98] font-bold",
        whatsappOutline: "border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-foreground font-bold",
        hero: "bg-cta-foreground text-primary border-0 hover:bg-cta-foreground/90 active:scale-[0.98] font-bold shadow-md",
        heroOutline: "border-2 border-cta-foreground bg-transparent text-cta-foreground hover:bg-cta-foreground/10 font-bold",
        tertiary: "bg-muted text-foreground hover:bg-muted/80 active:scale-[0.98]",
      },
      size: {
        default: "h-12 px-6 py-3 min-w-[44px]",
        sm: "h-10 rounded-md px-4 text-sm min-w-[44px]",
        lg: "h-13 rounded-xl px-8 text-base min-w-[44px]",
        xl: "h-14 rounded-xl px-10 text-lg min-w-[44px]",
        icon: "h-12 w-12 min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
