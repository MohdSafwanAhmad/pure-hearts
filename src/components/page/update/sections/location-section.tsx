import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { canadianProvinces } from "@/src/types/auth-organizations-types";

interface LocationSectionProps {
  formData: {
    country: string;
    state: string;
    city: string;
    address: string;
  };
  errors: Record<string, string[]>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (field: string) => (value: string) => void;
}

export function LocationSection({
  formData,
  errors,
  onInputChange,
  onSelectChange,
}: LocationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="country" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Country
          </Label>
          <Input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            readOnly
            className="bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="state" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Province/Territory *
          </Label>
          <div className="w-full max-w-md">
            <Select
              name="state"
              required
              value={formData.state}
              onValueChange={onSelectChange("state")}
            >
              <SelectTrigger className={`w-full ${errors?.state ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select your province or territory" />
              </SelectTrigger>
              <SelectContent>
                {canadianProvinces.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors?.state && (
            <p className="text-sm text-red-500">{errors.state[0]}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="city" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            City *
          </Label>
          <Input
            id="city"
            name="city"
            type="text"
            placeholder="Toronto"
            required
            value={formData.city}
            onChange={onInputChange("city")}
            className={errors?.city ? "border-red-500" : ""}
          />
          {errors?.city && (
            <p className="text-sm text-red-500">{errors.city[0]}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Street Address *
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main Street"
            required
            value={formData.address}
            onChange={onInputChange("address")}
            className={errors?.address ? "border-red-500" : ""}
          />
          {errors?.address && (
            <p className="text-sm text-red-500">{errors.address[0]}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}