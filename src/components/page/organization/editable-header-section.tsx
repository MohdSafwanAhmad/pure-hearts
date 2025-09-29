import { Organization } from "@/src/api/organization";
import { Heading } from "@/src/components/global/heading";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { TOrganizationSchema } from "@/src/schemas/organization";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";

interface Props {
  organization: Organization;
  form: UseFormReturn<TOrganizationSchema>;
  isEditing: boolean;
}

export function EditableHeaderSection({
  organization,
  form,
  isEditing,
}: Props) {
  return (
    <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 mb-section">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center text-white">
          {/* Organization Logo */}
          <div className="w-48 h-48 lg:w-64 lg:h-64 bg-background rounded-lg shadow-lg overflow-hidden relative">
            {organization.logo ? (
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

          {/* Organization Info */}

          {isEditing ? (
            <div className="flex-1 text-center lg:text-left">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem className="mb-2">
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
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <span className="text-md md:text-lg items-center flex">
                  <MapPin className="inline-block mr-1" />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Your City"
                            className={
                              form.formState.errors?.city
                                ? "border-red-500"
                                : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {" - "}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Your State"
                            className={
                              form.formState.errors?.state
                                ? "border-red-500"
                                : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-center lg:text-left">
              <Heading level={1} className="mb-2">
                {organization.organization_name}
              </Heading>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <span className="text-md md:text-lg items-center flex">
                  <MapPin className="inline-block mr-1" />
                  {organization.city} - {organization.state}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
