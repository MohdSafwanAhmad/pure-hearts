import { Card, CardContent } from "@/src/components/ui/card";

export function OrganizationStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-transparent border border-gray-300">
        <CardContent className="px-4 text-left">
          <div className="text-emerald-600 text-sm font-semibold mb-1">
            Completed Projects
          </div>
          <div className="text-2xl font-bold">4</div>
          <div className="text-gray-600 text-sm">Projects</div>
        </CardContent>
      </Card>
      <Card className="bg-transparent border border-gray-300">
        <CardContent className="px-4 text-left">
          <div className="text-emerald-600 text-sm font-semibold mb-1">
            Active Projects
          </div>
          <div className="text-2xl font-bold">2</div>
          <div className="text-gray-600 text-sm">Projects</div>
        </CardContent>
      </Card>
      <Card className="bg-transparent border border-gray-300">
        <CardContent className="px-4 text-left">
          <div className="text-emerald-600 text-sm font-semibold mb-1">
            Total Donations
          </div>
          <div className="text-2xl font-bold">$12,450</div>
          <div className="text-gray-600 text-sm">Raised</div>
        </CardContent>
      </Card>
      <Card className="bg-transparent border border-gray-300">
        <CardContent className="px-4 text-left">
          <div className="text-emerald-600 text-sm font-semibold mb-1">
            Donors
          </div>
          <div className="text-2xl font-bold">89</div>
          <div className="text-gray-600 text-sm">Contributors</div>
        </CardContent>
      </Card>
    </div>
  );
}
