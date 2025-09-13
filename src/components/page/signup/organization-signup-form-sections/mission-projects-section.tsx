import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  SectionProps,
  projectAreaOptions,
} from "@/src/types/auth-organizations-types";

export function MissionProjectsSection({
  formData,
  errors,
  onUpdateFormData,
}: SectionProps) {
  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onUpdateFormData({ [field]: e.target.value });
    };

  const handleProjectAreaChange = (area: string, checked: boolean) => {
    const currentAreas = formData.projectAreas || [];
    if (checked) {
      onUpdateFormData({ projectAreas: [...currentAreas, area] });
    } else {
      onUpdateFormData({
        projectAreas: currentAreas.filter((p) => p !== area),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Label htmlFor="missionStatement">Mission Statement</Label>
        <Textarea
          id="missionStatement"
          name="missionStatement"
          placeholder="Describe your organization's mission and goals..."
          required
          value={formData.missionStatement}
          onChange={handleInputChange("missionStatement")}
          className={errors?.missionStatement ? "border-red-500" : ""}
        />
        {errors?.missionStatement && (
          <p className="text-sm text-red-500">{errors.missionStatement[0]}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>Project Areas</Label>
        <p className="text-xs text-muted-foreground">
          Select the areas your organization works in
        </p>
        <div className="grid grid-cols-2 gap-3">
          {projectAreaOptions.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={area}
                checked={formData.projectAreas?.includes(area) || false}
                onCheckedChange={(checked) =>
                  handleProjectAreaChange(area, checked as boolean)
                }
              />
              <Label htmlFor={area} className="text-sm">
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

      <div className="grid gap-3">
        <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          placeholder="https://www.yourorganization.org"
          value={formData.websiteUrl}
          onChange={handleInputChange("websiteUrl")}
        />
      </div>

      <div className="space-y-3">
        <Label>Social Media Links (Optional)</Label>
        <div className="grid gap-3">
          <Input
            name="facebookUrl"
            type="url"
            placeholder="Facebook URL"
            value={formData.facebookUrl}
            onChange={handleInputChange("facebookUrl")}
          />
          <Input
            name="twitterUrl"
            type="url"
            placeholder="Twitter URL"
            value={formData.twitterUrl}
            onChange={handleInputChange("twitterUrl")}
          />
          <Input
            name="instagramUrl"
            type="url"
            placeholder="Instagram URL"
            value={formData.instagramUrl}
            onChange={handleInputChange("instagramUrl")}
          />
          <Input
            name="linkedinUrl"
            type="url"
            placeholder="LinkedIn URL"
            value={formData.linkedinUrl}
            onChange={handleInputChange("linkedinUrl")}
          />
        </div>
      </div>
    </div>
  );
}
