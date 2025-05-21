import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type ButtonProps = React.ComponentProps<typeof Button>

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-rose-400 hover:bg-rose-500 text-white", className)} {...props}>
      {children}
    </Button>
  )
}

export function SecondaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-lavender-300 hover:bg-lavender-400 text-purple-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function DangerButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-fuchsia-500 hover:bg-fuchsia-600 text-white", className)} {...props}>
      {children}
    </Button>
  )
}

export function SuccessButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-teal-400 hover:bg-teal-500 text-white", className)} {...props}>
      {children}
    </Button>
  )
}

export function WarningButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-amber-300 hover:bg-amber-400 text-amber-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function InfoButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-sky-300 hover:bg-sky-400 text-sky-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function OutlineButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn("bg-transparent hover:bg-pink-50 text-pink-500 border-2 border-pink-300", className)}
      {...props}
    >
      {children}
    </Button>
  )
}

export function PastelPinkButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-pink-200 hover:bg-pink-300 text-pink-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function PastelPurpleButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-purple-200 hover:bg-purple-300 text-purple-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function PastelBlueButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-blue-200 hover:bg-blue-300 text-blue-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function PastelGreenButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-green-200 hover:bg-green-300 text-green-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function PastelYellowButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-yellow-200 hover:bg-yellow-300 text-yellow-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function PastelPeachButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-orange-200 hover:bg-orange-300 text-orange-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function MauveButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-purple-300 hover:bg-purple-400 text-purple-800", className)} {...props}>
      {children}
    </Button>
  )
}

export function LilacButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-violet-300 hover:bg-violet-400 text-violet-800", className)} {...props}>
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
      className={cn("bg-rose-400 hover:bg-rose-500 text-white", className)}
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
      className={cn("bg-fuchsia-500 hover:bg-fuchsia-600 text-white", className)}
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
      className={cn("bg-teal-400 hover:bg-teal-500 text-white", className)}
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

export function RoundedButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("rounded-full", className)} {...props}>
      {children}
    </Button>
  )
}
