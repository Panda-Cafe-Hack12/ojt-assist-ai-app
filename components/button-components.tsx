import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type ButtonProps = React.ComponentProps<typeof Button>

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-blue-600 hover:bg-blue-700 text-white", className)} {...props}>
      {children}
    </Button>
  )
}

export function SecondaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-gray-200 hover:bg-gray-300 text-gray-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function DangerButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-red-600 hover:bg-red-700 text-white", className)} {...props}>
      {children}
    </Button>
  )
}

export function SuccessButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-green-600 hover:bg-green-700 text-white", className)} {...props}>
      {children}
    </Button>
  )
}

export function WarningButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-amber-500 hover:bg-amber-600 text-white", className)} {...props}>
      {children}
    </Button>
  )
}

export function InfoButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-sky-500 hover:bg-sky-600 text-white", className)} {...props}>
      {children}
    </Button>
  )
}

export function OutlineButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn("bg-transparent hover:bg-gray-50 text-gray-800 border border-gray-300", className)}
      {...props}
    >
      {children}
    </Button>
  )
}

export function LoadingButton({
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button
      className={cn("bg-blue-600 hover:bg-blue-700 text-white", className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  )
}

export function LoadingDangerButton({
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button
      className={cn("bg-red-600 hover:bg-red-700 text-white", className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  )
}

export function LoadingSuccessButton({
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button
      className={cn("bg-green-600 hover:bg-green-700 text-white", className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  )
}

export function SmallButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("h-8 px-3 text-xs", className)} size="sm" {...props}>
      {children}
    </Button>
  )
}

export function LargeButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("h-12 px-6 text-base", className)} size="lg" {...props}>
      {children}
    </Button>
  )
}
