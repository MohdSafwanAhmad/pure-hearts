import { Organization } from "@/src/api/organization";
import { Heading } from "@/src/components/global/heading";
import { MapPin } from "lucide-react";
import Image from "next/image";
interface OrganizationHeaderProps {
  organization: Organization;
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
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
        </div>
      </div>
    </div>
  );
}
