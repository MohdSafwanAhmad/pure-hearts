"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { submitVerificationRequest } from "@/src/actions/verification-request";
import { toast } from "sonner";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

interface VerificationRequestDialogProps {
  buttonText?: string;
}

export function VerificationRequestDialog({
  buttonText = "Request Verification",
}: VerificationRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF documents are allowed");
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 1MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a document to upload");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);

      const result = await submitVerificationRequest({
        documentBase64: base64,
        documentName: file.name,
        documentType: file.type,
      });

      if (result.success) {
        toast.success(
          "Verification request submitted successfully! We'll review your request and get back to you soon.",
        );
        setOpen(false);
        setFile(null);
      } else {
        toast.error(result.error || "Failed to submit verification request");
      }
    } catch (error) {
      console.error("Error submitting verification request:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-white whitespace-nowrap"
        >
          <CheckCircle2 className="mr-1 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Organization Verification</DialogTitle>
          <DialogDescription>
            Upload a verification document (e.g., tax receipt, registration
            certificate, or other official documents) to verify your
            organization. Maximum file size: 1MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="document">Verification Document (PDF only)</Label>

            {/* Upload Section */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="document"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF only (max. 1MB)</p>
                </div>
                <input
                  id="document"
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </label>
            </div>

            {/* Selected file info */}
            {file && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                  disabled={isSubmitting}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Acceptable documents:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Tax-exempt certificate or charity registration</li>
                  <li>Official registration documents</li>
                  <li>Government-issued licenses</li>
                  <li>Other official organizational documents</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit Request</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
