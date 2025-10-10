import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { TCreateOrganizationSchema } from "@/src/schemas/organization";
import { canadianProvinces } from "@/src/lib/constants";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<TCreateOrganizationSchema>;
};

export function LocationSection({ form }: Props) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Country
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              State/Province *
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Select your state or province" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {canadianProvinces.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              City *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="Montreal"
                className={form.formState.errors?.city ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Street Address *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                placeholder="123 Main Street"
                className={
                  form.formState.errors?.address ? "border-red-500" : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
