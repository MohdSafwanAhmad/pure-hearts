import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SectionProps,
  canadianProvinces,
} from "@/src/types/auth-organizations-types";

export function LocationSection({
  formData,
  errors,
  onUpdateFormData,
}: SectionProps) {
  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateFormData({ [field]: e.target.value });
    };

  const handleSelectChange =
    (field: keyof typeof formData) => (value: string) => {
      onUpdateFormData({ [field]: value });
    };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          type="text"
          value={formData.country}
          readOnly
          className="bg-gray-100 dark:bg-gray-800"
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="state">Province</Label>
        <Select
          name="state"
          required
          value={formData.state}
          onValueChange={handleSelectChange("state")}
        >
          <SelectTrigger className={errors?.state ? "border-red-500" : ""}>
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {canadianProvinces.map((province) => (
              <SelectItem key={province.value} value={province.value}>
                {province.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.state && (
          <p className="text-sm text-red-500">{errors.state[0]}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          type="text"
          placeholder="Toronto"
          required
          value={formData.city}
          onChange={handleInputChange("city")}
          className={errors?.city ? "border-red-500" : ""}
        />
        {errors?.city && (
          <p className="text-sm text-red-500">{errors.city[0]}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          placeholder="123 Main Street"
          required
          value={formData.address}
          onChange={handleInputChange("address")}
          className={errors?.address ? "border-red-500" : ""}
        />
        {errors?.address && (
          <p className="text-sm text-red-500">{errors.address[0]}</p>
        )}
      </div>
    </div>
  );
}
