import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Button,
} from "@react-email/components";

interface VerificationRequestEmailProps {
  organizationName: string;
  contactPersonName: string;
  contactPersonEmail: string;
  organizationPhone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  missionStatement: string;
  websiteUrl?: string;
  organizationId: string;
  submittedDate: string;
  verificationRequestId: string;
  reviewUrl: string;
}

export const VerificationRequestEmail = ({
  organizationName,
  contactPersonName,
  contactPersonEmail,
  organizationPhone,
  country,
  state,
  city,
  address,
  postalCode,
  missionStatement,
  websiteUrl,
  organizationId,
  submittedDate,
  verificationRequestId,
  reviewUrl,
}: VerificationRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New verification request from {organizationName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Organization Verification Request</Heading>

          <Text style={dateText}>
            <strong>Submitted on:</strong> {submittedDate}
          </Text>

          <Text style={text}>
            A new organization has requested verification on Pure Hearts.
          </Text>

          <Section style={detailsSection}>
            <Heading style={h2}>Organization Information</Heading>

            <Text style={detailText}>
              <strong>Organization Name:</strong> {organizationName}
            </Text>

            <Text style={detailText}>
              <strong>Contact Person:</strong> {contactPersonName}
            </Text>

            <Text style={detailText}>
              <strong>Email:</strong> {contactPersonEmail}
            </Text>

            <Text style={detailText}>
              <strong>Phone:</strong> {organizationPhone}
            </Text>

            <Hr style={hr} />

            <Heading style={h3}>Location</Heading>

            <Text style={detailText}>
              <strong>Country:</strong> {country}
            </Text>

            <Text style={detailText}>
              <strong>City:</strong> {city}
            </Text>

            <Text style={detailText}>
              <strong>Address:</strong> {address}
            </Text>

            <Text style={detailText}>
              <strong>State/Province:</strong> {state}
            </Text>

            <Text style={detailText}>
              <strong>Postal Code:</strong> {postalCode}
            </Text>

            <Hr style={hr} />

            <Heading style={h3}>Additional Information</Heading>

            <Text style={detailText}>
              <strong>Mission Statement:</strong>
            </Text>
            <Text style={text}>{missionStatement}</Text>

            {websiteUrl && (
              <Text style={detailText}>
                <strong>Website:</strong> {websiteUrl}
              </Text>
            )}

            <Hr style={hr} />

            <Text style={detailText}>
              <strong>Organization ID:</strong> {organizationId}
            </Text>

            <Text style={detailText}>
              <strong>Request ID:</strong> {verificationRequestId}
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button href={reviewUrl} style={button}>
              Review Verification Request
            </Button>
          </Section>

          <Text style={text}>
            Click the button above to review the organization information and
            uploaded documents. You can approve or reject this verification
            request from the review page.
          </Text>

          <Text style={footer}>
            This is an automated email from Pure Hearts. Please do not reply to
            this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles with orange/amber theme for verification
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const h1 = {
  color: "#c2410c",
  fontSize: "28px",
  fontWeight: "bold" as const,
  margin: "0 0 24px",
  lineHeight: "1.4",
};

const h2 = {
  color: "#c2410c",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
};

const h3 = {
  color: "#c2410c",
  fontSize: "16px",
  fontWeight: "bold" as const,
  margin: "16px 0 12px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const dateText = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 24px",
  fontWeight: "bold" as const,
};

const detailsSection = {
  backgroundColor: "#fff7ed",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  border: "1px solid #fed7aa",
};

const detailText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "4px 0",
};

const hr = {
  borderColor: "#fed7aa",
  margin: "20px 0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#c2410c",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  cursor: "pointer",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "32px",
  margin: "32px 0 0",
};
