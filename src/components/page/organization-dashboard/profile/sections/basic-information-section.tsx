import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TUpdateOrganizationSchema } from "@/src/schemas/organization";

interface BasicInformationSectionProps {
  form: UseFormReturn<TUpdateOrganizationSchema>;
}

export function BasicInformationSection({
  form,
}: BasicInformationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Organization Name *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Your Organization Name"
                    className={
                      form.formState.errors?.organizationName
                        ? "border-red-500"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="organizationPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Organization Phone *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="+15554443333"
                    className={
                      form.formState.errors?.organizationPhone
                        ? "border-red-500"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Contact Person Information *
          </Label>
          <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <FormField
              control={form.control}
              name="contactPersonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Contact Person Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Your Organization Name"
                      className={
                        form.formState.errors?.contactPersonName
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPersonEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Contact person email"
                      className={
                        form.formState.errors?.contactPersonEmail
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPersonPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="+15554443333"
                      className={
                        form.formState.errors?.contactPersonPhone
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
