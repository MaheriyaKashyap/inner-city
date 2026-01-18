import * as React from "react"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}: React.ComponentProps<typeof Sonner>) => {
  // Get theme from localStorage or default to system
  const getTheme = () => {
    if (typeof window === 'undefined') return 'system'
    const stored = localStorage.getItem('inner_city_theme')
    if (stored && stored.includes('dark')) return 'dark'
    if (stored && stored.includes('bright')) return 'light'
    return 'system'
  }

  const theme = getTheme()

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props} />
  );
}

export { Toaster }
