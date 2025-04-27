"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info"

interface ToastProps {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: React.ReactNode
}

// Legacy toast function that mimics your old useToast behavior
function toast(props: ToastProps) {
  const { title, description, variant = "default", duration = 5000, action } = props

  // Map variants to sonner toast types
  switch (variant) {
    case "destructive":
      return sonnerToast.error(title, {
        description,
        duration,
        action
      })
    case "success":
      return sonnerToast.success(title, {
        description,
        duration,
        action
      })
    case "warning":
      return sonnerToast.warning(title, {
        description,
        duration,
        action
      })
    case "info":
      return sonnerToast.info(title, {
        description,
        duration,
        action
      })
    default:
      return sonnerToast(title, {
        description,
        duration,
        action
      })
  }
}

// Legacy hook for compatibility with existing code
function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss
  }
}

export { useToast, toast }