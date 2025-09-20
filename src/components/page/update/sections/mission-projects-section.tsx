import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { projectAreaOptions } from "@/src/types/auth-organizations-types";

interface MissionProjectsSectionProps {
  formData: {
    missionStatement: string;
    projectAreas: string[];
    websiteUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    linkedinUrl: string;
  };
  errors: Record<string, string[]>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onProjectAreaChange: (area: string, checked: boolean) => void;
}

export function MissionProjectsSection({
  formData,
  errors,
  onInputChange,
  onProjectAreaChange,
}: MissionProjectsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Mission & Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="missionStatement" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Mission Statement *
          </Label>
          <Textarea
            id="missionStatement"
            name="missionStatement"
            placeholder="Describe your organization's mission and goals..."
            required
            value={formData.missionStatement}
            onChange={onInputChange("missionStatement")}
            className={errors?.missionStatement ? "border-red-500" : ""}
          />
          {errors?.missionStatement && (
            <p className="text-sm text-red-500">{errors.missionStatement[0]}</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Project Areas *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Select the areas your organization works in
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
            {projectAreaOptions.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={formData.projectAreas?.includes(area) || false}
                  onCheckedChange={(checked) =>
                    onProjectAreaChange(area, checked as boolean)
                  }
                />
                <Label htmlFor={area} className="text-sm font-medium">
                  {area}
                </Label>
              </div>
            ))}
          </div>
          {formData.projectAreas?.map((area) => (
            <input key={area} type="hidden" name="projectAreas" value={area} />
          ))}
          {errors?.projectAreas && (
            <p className="text-sm text-red-500">{errors.projectAreas[0]}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="websiteUrl" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Website URL <span className="text-gray-400">(Optional)</span>
          </Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            placeholder="https://www.yourorganization.org"
            value={formData.websiteUrl}
            onChange={onInputChange("websiteUrl")}
            className={errors?.websiteUrl ? "border-red-500" : ""}
          />
          {errors?.websiteUrl && (
            <p className="text-sm text-red-500">{errors.websiteUrl[0]}</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Social Media Links <span className="text-gray-400">(Optional)</span>
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Add your organization&apos;s social media presence
            </p>
          </div>
          <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Facebook
              </Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                placeholder="https://www.facebook.com/yourorganization"
                value={formData.facebookUrl}
                onChange={onInputChange("facebookUrl")}
                className={errors?.facebookUrl ? "border-red-500" : ""}
              />
              {errors?.facebookUrl && (
                <p className="text-sm text-red-500">{errors.facebookUrl[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitterUrl" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Twitter/X
              </Label>
              <Input
                id="twitterUrl"
                name="twitterUrl"
                type="url"
                placeholder="https://twitter.com/yourorganization"
                value={formData.twitterUrl}
                onChange={onInputChange("twitterUrl")}
                className={errors?.twitterUrl ? "border-red-500" : ""}
              />
              {errors?.twitterUrl && (
                <p className="text-sm text-red-500">{errors.twitterUrl[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagramUrl" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Instagram
              </Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                placeholder="https://www.instagram.com/yourorganization"
                value={formData.instagramUrl}
                onChange={onInputChange("instagramUrl")}
                className={errors?.instagramUrl ? "border-red-500" : ""}
              />
              {errors?.instagramUrl && (
                <p className="text-sm text-red-500">{errors.instagramUrl[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                LinkedIn
              </Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                placeholder="https://www.linkedin.com/company/yourorganization"
                value={formData.linkedinUrl}
                onChange={onInputChange("linkedinUrl")}
                className={errors?.linkedinUrl ? "border-red-500" : ""}
              />
              {errors?.linkedinUrl && (
                <p className="text-sm text-red-500">{errors.linkedinUrl[0]}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}