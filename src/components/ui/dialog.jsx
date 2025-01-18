import * as React from "react"
    import * as DialogPrimitive from "@radix-ui/react-dialog"
    import { X } from "lucide-react"
    import { cn } from "../../lib/utils"

    const Dialog = DialogPrimitive.Root
    const DialogTrigger = DialogPrimitive.Trigger

    const DialogPortal = ({ className, ...props }) => (
      <DialogPrimitive.Portal className={cn(className)} {...props} />
    )
    DialogPortal.displayName = "DialogPortal"

    const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
        {...props}
      />
    ))
    DialogOverlay.displayName = "DialogOverlay"

    const DialogContent = React.forwardRef(({ className, ...props }, ref) => (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-top-1/2 sm:rounded-lg",
            className
          )}
          {...props}
        />
      </DialogPortal>
    ))
    DialogContent.displayName = "DialogContent"

    const DialogHeader = ({ className, ...props }) => (
      <div
        className={cn(
          "flex flex-col space-y-1.5 text-center sm:text-left",
          className
        )}
        {...props}
      />
    )
    DialogHeader.displayName = "DialogHeader"

    const DialogFooter = ({ className, ...props }) => (
      <div
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
          className
        )}
        {...props}
      />
    )
    DialogFooter.displayName = "DialogFooter"

    const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
      <DialogPrimitive.Title
        ref={ref}
        className={cn(
          "text-lg font-semibold leading-none tracking-tight",
          className
        )}
        {...props}
      />
    ))
    DialogTitle.displayName = "DialogTitle"

    const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
      <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ))
    DialogDescription.displayName = "DialogDescription"

    const DialogClose = React.forwardRef(({ className, ...props }, ref) => (
      <DialogPrimitive.Close
        ref={ref}
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
          className
        )}
        {...props}
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    ))
    DialogClose.displayName = "DialogClose"

    export {
      Dialog,
      DialogTrigger,
      DialogContent,
      DialogHeader,
      DialogFooter,
      DialogTitle,
      DialogDescription,
      DialogClose,
    }
