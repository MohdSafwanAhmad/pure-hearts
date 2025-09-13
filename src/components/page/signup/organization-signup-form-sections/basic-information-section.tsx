import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { SectionProps } from "@/src/types/auth-organizations-types";

export function BasicInformationSection({
  formData,
  errors,
  onUpdateFormData,
}: SectionProps) {
  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateFormData({ [field]: e.target.value });
    };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input
          id="organizationName"
          name="organizationName"
          type="text"
          placeholder="Your Organization Name"
          required
          value={formData.organizationName}
          onChange={handleInputChange("organizationName")}
          className={errors?.organizationName ? "border-red-500" : ""}
        />
        {errors?.organizationName && (
          <p className="text-sm text-red-500">{errors.organizationName[0]}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="organizationEmail">Organization Email</Label>
        <Input
          id="organizationEmail"
          name="organizationEmail"
          type="email"
          placeholder="contact@organization.org"
          required
          value={formData.organizationEmail}
          onChange={handleInputChange("organizationEmail")}
          className={errors?.organizationEmail ? "border-red-500" : ""}
        />
        {errors?.organizationEmail && (
          <p className="text-sm text-red-500">{errors.organizationEmail[0]}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="organizationPhone">Organization Phone</Label>
        <Input
          id="organizationPhone"
          name="organizationPhone"
          type="tel"
          placeholder="+15554443333"
          required
          value={formData.organizationPhone}
          onChange={handleInputChange("organizationPhone")}
          className={errors?.organizationPhone ? "border-red-500" : ""}
        />
        {errors?.organizationPhone && (
          <p className="text-sm text-red-500">{errors.organizationPhone[0]}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>Contact Person</Label>
        <div className="grid gap-3">
          <Input
            name="contactPersonName"
            placeholder="Contact person name"
            required
            value={formData.contactPersonName}
            onChange={handleInputChange("contactPersonName")}
            className={errors?.contactPersonName ? "border-red-500" : ""}
          />
          {errors?.contactPersonName && (
            <p className="text-sm text-red-500">
              {errors.contactPersonName[0]}
            </p>
          )}
          <Input
            name="contactPersonEmail"
            type="email"
            placeholder="Contact person email"
            required
            value={formData.contactPersonEmail}
            onChange={handleInputChange("contactPersonEmail")}
            className={errors?.contactPersonEmail ? "border-red-500" : ""}
          />
          {errors?.contactPersonEmail && (
            <p className="text-sm text-red-500">
              {errors.contactPersonEmail[0]}
            </p>
          )}
          <Input
            name="contactPersonPhone"
            type="tel"
            required
            placeholder="+15554443333"
            value={formData.contactPersonPhone}
            onChange={handleInputChange("contactPersonPhone")}
          />
          {errors?.contactPersonPhone && (
            <p className="text-sm text-red-500">
              {errors.contactPersonPhone[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
