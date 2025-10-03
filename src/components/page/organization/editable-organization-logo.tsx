import { updateOrganizationLogo } from "@/src/actions/organization";
import { Organization } from "@/src/api/organization";
import { Heading } from "@/src/components/global/heading";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Pencil, Upload } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface OrganizationLogoProps {
  organization: Organization;
  isEditing: boolean;
}

export function EditableOrganizationLogo({
  organization,
  isEditing,
}: OrganizationLogoProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

  // Reset preview when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileSizeError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isDialogOpen]);

  // Generate preview URL when a file is selected
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // Cleanup function to revoke the object URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleLogoClick = () => {
    if (isEditing) {
      setIsDialogOpen(true);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileSizeError(
          "File size exceeds 1MB. Please choose a smaller file."
        );
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setFileSizeError(null);
        setSelectedFile(file);
      }
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      try {
        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append("file", selectedFile);

        setIsUploading(true);
        // Call the server action
        const result = await updateOrganizationLogo(formData);

        if (!result.success) {
          toast.error("Error uploading logo: " + result.error);
        } else {
          toast.success("Logo upload success");
        }
      } catch {
        toast.error("Oops! Something went wrong during the upload.");
      } finally {
        setIsUploading(false);
      }

      // Close the dialog
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div
        className={`w-48 h-48 lg:w-64 lg:h-64 bg-background rounded-lg shadow-lg overflow-hidden relative ${
          isEditing ? "cursor-pointer" : ""
        }`}
        onClick={handleLogoClick}
      >
        {organization.logo ? (
          <>
            <Image
              src={organization.logo}
              alt={organization.organization_name}
              fill
              className="object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/30 shadow-inner flex items-center justify-center">
                <Pencil className="text-white w-12 h-12 drop-shadow-lg" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 relative">
            <Heading level={1} className="text-gray-500">
              {organization.organization_name.charAt(0).toUpperCase()}
            </Heading>
            {isEditing && (
              <div className="absolute inset-0 bg-black/30 shadow-inner flex items-center justify-center">
                <Pencil className="text-white w-12 h-12 drop-shadow-lg" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logo Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Organization Logo</DialogTitle>
            <DialogDescription>
              Upload a new logo for your organization. Recommended size is
              1024*1024 pixels. Maximum file size is 1MB.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Preview Section */}
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-lg overflow-hidden relative border-2 border-gray-300">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Logo Preview"
                    fill
                    className="object-cover"
                  />
                ) : organization.logo ? (
                  <Image
                    src={organization.logo}
                    alt={organization.organization_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Heading level={1} className="text-gray-500">
                      {organization.organization_name.charAt(0).toUpperCase()}
                    </Heading>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP</p>
                </div>
                <input
                  ref={fileInputRef}
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* File size error message */}
            {fileSizeError && (
              <p className="text-sm text-center text-red-600 font-medium">
                {fileSizeError}
              </p>
            )}

            {selectedFile && (
              <p className="text-sm text-center">
                Selected file:{" "}
                <span className="font-medium">{selectedFile.name}</span> (
                {Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUploadClick}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Logo"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
