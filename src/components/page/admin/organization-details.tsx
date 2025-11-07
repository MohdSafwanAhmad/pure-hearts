"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Phone, Mail, Globe, MapPin, FileText, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

interface OrganizationDetailsProps {
  organization: {
    organizationName: string;
    organizationPhone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    postalCode: string;
    missionStatement: string;
    websiteUrl: string | null;
    logo: string | null;
    contactPersonName: string | null;
    contactPersonEmail: string | null;
    contactPersonPhone: string | null;
    projectAreas: {
      id: number;
      label: string;
    }[];
  };
  documentName: string;
  documentUrl: string | null;
  submittedDate: string;
}

export function OrganizationDetails({
  organization,
  documentName,
  documentUrl,
  submittedDate,
}: OrganizationDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-base py-1 px-3">
          Status: Pending Review
        </Badge>
        <span className="text-sm text-muted-foreground">
          Submitted: {submittedDate}
        </span>
      </div>

      {/* Organization Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            {organization.logo ? (
              <Image
                src={organization.logo}
                alt={`${organization.organizationName} logo`}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {organization.organizationName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-2xl">
                {organization.organizationName}
              </CardTitle>
              <CardDescription className="mt-2">
                {organization.missionStatement}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{organization.organizationPhone}</span>
            </div>
            {organization.websiteUrl && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={organization.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {organization.websiteUrl}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {organization.address}, {organization.city}, {organization.state}
                , {organization.postalCode}, {organization.country}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Person */}
      {organization.contactPersonName && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Person</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold">{organization.contactPersonName}</p>
            </div>
            {organization.contactPersonEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{organization.contactPersonEmail}</span>
              </div>
            )}
            {organization.contactPersonPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{organization.contactPersonPhone}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Project Areas */}
      {organization.projectAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {organization.projectAreas.map((area) => (
                <Badge key={area.id} variant="secondary">
                  {area.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Verification Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{documentName}</p>
          {documentUrl && (
            <Button asChild variant="outline">
              <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Document
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
