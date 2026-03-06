"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, X, ScanLine, Image } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "complete" | "error"
}

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void
}

export function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }, [])

  const processFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate processing
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "processing" as const } : f
          )
        )
      }, 500 + index * 200)

      setTimeout(() => {
        setFiles((prev) => {
          const updated = prev.map((f) =>
            f.id === file.id ? { ...f, status: "complete" as const } : f
          )
          onFilesUploaded(updated.filter((f) => f.status === "complete"))
          return updated
        })
      }, 1500 + index * 300)
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image
    return FileText
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Upload Medical Records</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Drag and drop files here, or click to select
          </p>
          <div className="flex gap-3">
            <label>
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileSelect}
              />
              <Button variant="outline" className="cursor-pointer gap-2" asChild>
                <span>
                  <FileText className="h-4 w-4" />
                  Browse Files
                </span>
              </Button>
            </label>
            <Button variant="outline" className="gap-2">
              <ScanLine className="h-4 w-4" />
              Scan Document
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Supports PDF, JPG, PNG, DOC, DOCX
          </p>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type)
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "uploading" && (
                    <span className="text-sm text-muted-foreground">Uploading...</span>
                  )}
                  {file.status === "processing" && (
                    <span className="text-sm text-primary">Processing...</span>
                  )}
                  {file.status === "complete" && (
                    <span className="text-sm text-success">Complete</span>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="rounded p-1 hover:bg-secondary"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
