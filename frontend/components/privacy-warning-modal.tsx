"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Shield, AlertTriangle, Lock, Eye } from "lucide-react"

export function PrivacyWarningModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem("privacyWarningShown")
    if (!hasSeenWarning) {
      setOpen(true)
    }
  }, [])

  const handleAccept = () => {
    sessionStorage.setItem("privacyWarningShown", "true")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Data Privacy Notice</DialogTitle>
          <DialogDescription className="text-center">
            Please read this important information about your data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
            <Lock className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">UUID-Based Anonymization</p>
              <p className="text-sm text-muted-foreground">
                All patient data is assigned a unique identifier. No personal information is stored or associated with your records.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
            <Eye className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">PII Removal</p>
              <p className="text-sm text-muted-foreground">
                Names, contact information, and other identifying data are automatically stripped using advanced pattern matching.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-warning/50 bg-warning/10 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="font-medium text-foreground">Important</p>
              <p className="text-sm text-muted-foreground">
                Do not close this tab while processing. Your data is processed locally and not stored on our servers.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} className="w-full">
            I Understand, Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
