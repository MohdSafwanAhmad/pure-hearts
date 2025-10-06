"use client";

import { Heading } from "@/src/components/global/heading";
import { TUpdateOrganizationSchema } from "@/src/schemas/organization";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Textarea } from "@/src/components/ui/textarea";
import { EditableContactSection } from "./editable-contact-section";
import { EditableOverviewSection } from "./editable-overview-section";
import { EditablePrivateSection } from "./editable-private-section";

interface Props {
  organization: {
    organization_name: string;
    organization_phone: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    mission_statement: string;
    website_url: string | null;
    facebook_url: string | null;
    twitter_url: string | null;
    instagram_url: string | null;
    linkedin_url: string | null;
    project_areas: {
      id: number;
      label: string;
    }[];
  };
  form: UseFormReturn<TUpdateOrganizationSchema>;
  isEditing: boolean;
  projectAreas: { value: number; label: string }[];
}

type TabKey = "contact" | "overview" | "private";

interface Tab {
  key: TabKey;
  label: string;
  visibleOnlyInEditMode?: boolean;
}

const tabs: Tab[] = [
  { key: "contact", label: "Contact Data" },
  { key: "overview", label: "Overview" },
  { key: "private", label: "Private Information", visibleOnlyInEditMode: true },
];

export function EditableDetailsSection({
  organization,
  form,
  isEditing,
  projectAreas,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const projectAreasLabels = organization.project_areas.map(
    (area) => area.label
  );

  const overviewItems = [
    {
      label: "Name of the Organization",
      value: organization.organization_name,
    },
    {
      label: "Organization Area",
      value: projectAreasLabels.join(", "),
    },
    {
      label: "Street Address",
      value: organization.address,
    },
    {
      label: "Province/State",
      value: organization.state,
    },
    {
      label: "City",
      value: organization.city,
    },
    {
      label: "Country",
      value: organization.country,
    },
  ];

  const contactItems = [
    {
      label: "Organization Phone",
      value: organization.organization_phone,
      type: "phone",
    },
    {
      label: "Website",
      value: organization.website_url,
      type: "link",
    },
    {
      label: "Facebook",
      value: organization.facebook_url,
      type: "link",
    },
    {
      label: "Twitter",
      value: organization.twitter_url,
      type: "link",
    },
    {
      label: "Instagram",
      value: organization.instagram_url,
      type: "link",
    },
    {
      label: "LinkedIn",
      value: organization.linkedin_url,
      type: "link",
    },
  ].filter((item) => item.value); // Filter out null or undefined values

  const renderTabContent = () => {
    switch (activeTab) {
      case "contact":
        return isEditing ? (
          <EditableContactSection form={form} />
        ) : (
          <div className="grid gap-x-6 grid-cols-1 sm:grid-cols-2 divide-y">
            {contactItems.map((item, index) => (
              <div key={index} className="py-4">
                <span className="text-gray-600">{item.label}</span>
                <div className="font-semibold">
                  {item.type === "phone" ? (
                    <a
                      href={`tel:${item.value}`}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {item.value}
                    </a>
                  ) : item.type === "link" ? (
                    <a
                      href={item.value!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "private":
        // Only show this tab in edit mode
        return isEditing ? (
          <EditablePrivateSection form={form} />
        ) : (
          <div className="py-4 text-center text-gray-500">
            Private information is only available in edit mode.
          </div>
        );

      case "overview":
      default:
        return isEditing ? (
          <EditableOverviewSection form={form} projectAreas={projectAreas} />
        ) : (
          <div className="grid gap-x-6 grid-cols-1 sm:grid-cols-2 divide-y">
            {overviewItems.map((item, index) => (
              <div key={index} className="py-4">
                <span className="text-gray-600">{item.label}</span>
                <div className="font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <section className="mb-section">
      {/* Organization Description */}
      <div className="mb-subtitle">
        <Heading level={2} className="mb-element">
          About {organization.organization_name}
        </Heading>
        {isEditing ? (
          <FormField
            control={form.control}
            name="missionStatement"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your organization's mission and goals..."
                    className={
                      form.formState.errors?.missionStatement
                        ? "border-red-500"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">
            {organization.mission_statement}
          </p>
        )}
      </div>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-0">
          {tabs
            .filter(
              (tab) =>
                !tab.visibleOnlyInEditMode ||
                (tab.visibleOnlyInEditMode && isEditing)
            )
            .map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(tab.key);
                }}
                className={`py-2 px-1 border-b-4 ${
                  activeTab === tab.key
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
        </nav>
      </div>
      <div className="space-y-6">
        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </section>
  );
}
