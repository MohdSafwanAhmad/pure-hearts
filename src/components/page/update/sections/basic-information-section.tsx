import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface BasicInformationSectionProps {
  formData: {
    organizationName: string;
    organizationPhone: string;
    contactPersonName: string;
    contactPersonEmail: string;
    contactPersonPhone: string;
  };
  errors: Record<string, string[]>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicInformationSection({
  formData,
  errors,
  onInputChange,
}: BasicInformationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="organizationName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Organization Name *
          </Label>
          <Input
            id="organizationName"
            name="organizationName"
            type="text"
            placeholder="Your Organization Name"
            required
            value={formData.organizationName}
            onChange={onInputChange("organizationName")}
            className={errors?.organizationName ? "border-red-500" : ""}
          />
          {errors?.organizationName && (
            <p className="text-sm text-red-500">{errors.organizationName[0]}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="organizationPhone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Organization Phone *
          </Label>
          <Input
            id="organizationPhone"
            name="organizationPhone"
            type="tel"
            placeholder="+15554443333"
            required
            value={formData.organizationPhone}
            onChange={onInputChange("organizationPhone")}
            className={errors?.organizationPhone ? "border-red-500" : ""}
          />
          {errors?.organizationPhone && (
            <p className="text-sm text-red-500">{errors.organizationPhone[0]}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Contact Person Information *
          </Label>
          <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Label htmlFor="contactPersonName" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Full Name *
              </Label>
              <Input
                id="contactPersonName"
                name="contactPersonName"
                placeholder="Contact person name"
                required
                value={formData.contactPersonName}
                onChange={onInputChange("contactPersonName")}
                className={errors?.contactPersonName ? "border-red-500" : ""}
              />
              {errors?.contactPersonName && (
                <p className="text-sm text-red-500">{errors.contactPersonName[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPersonEmail" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Email Address *
              </Label>
              <Input
                id="contactPersonEmail"
                name="contactPersonEmail"
                type="email"
                placeholder="Contact person email"
                required
                value={formData.contactPersonEmail}
                onChange={onInputChange("contactPersonEmail")}
                className={errors?.contactPersonEmail ? "border-red-500" : ""}
              />
              {errors?.contactPersonEmail && (
                <p className="text-sm text-red-500">{errors.contactPersonEmail[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPersonPhone" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Phone Number *
              </Label>
              <Input
                id="contactPersonPhone"
                name="contactPersonPhone"
                type="tel"
                required
                placeholder="+15554443333"
                value={formData.contactPersonPhone}
                onChange={onInputChange("contactPersonPhone")}
                className={errors?.contactPersonPhone ? "border-red-500" : ""}
              />
              {errors?.contactPersonPhone && (
                <p className="text-sm text-red-500">{errors.contactPersonPhone[0]}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}