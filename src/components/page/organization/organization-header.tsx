import { Button } from "@/src/components/ui/button";
import { Organization } from "@/src/api/organization";
import { Heading } from "@/src/components/global/heading";
import { MapPin } from "lucide-react";
interface OrganizationHeaderProps {
  organization: Organization;
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 mb-6">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-center text-white">
          {/* Organization Logo */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <div className="w-32 h-32 lg:w-48 lg:h-48 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 text-xl font-bold">
                  {organization.organization_name.charAt(0)}
                </span>
              </div>
            </div>
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

          {/* Quick Donation Button */}
          <div className="flex-shrink-0">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
            >
              Quick Donation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
