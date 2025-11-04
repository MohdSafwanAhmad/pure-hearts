import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationApprovedEmailProps {
  organizationName: string;
  contactPersonName: string;
  reviewerName: string;
  dashboardUrl: string;
  adminNotes?: string;
}

export const VerificationApprovedEmail = ({
  organizationName,
  contactPersonName,
  reviewerName,
  dashboardUrl,
  adminNotes,
}: VerificationApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Congratulations! Your organization has been verified</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 Verification Approved!</Heading>
          
          <Text style={text}>Dear {contactPersonName},</Text>
          
          <Text style={text}>
            Great news! <strong>{organizationName}</strong> has been successfully 
            verified by our team.
          </Text>

          <Section style={successSection}>
            <Text style={successText}>
              Your organization is now fully verified and you can:
            </Text>
            <ul style={list}>
              <li style={listItem}>Create and publish projects</li>
              <li style={listItem}>Appear in public organization listings</li>
              <li style={listItem}>Accept donations from donors</li>
              <li style={listItem}>Build trust with your supporters</li>
            </ul>
          </Section>

          {adminNotes && (
            <Section style={notesSection}>
              <Heading style={h3}>Notes from Reviewer</Heading>
              <Text style={notesText}>{adminNotes}</Text>
            </Section>
          )}

          <Section style={detailsSection}>
            <Text style={detailText}>
              <strong>Reviewed by:</strong> {reviewerName}
            </Text>
            <Text style={detailText}>
              <strong>Organization:</strong> {organizationName}
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={footer}>
            Thank you for being part of Pure Hearts!
            <br />
            Pure Hearts Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationApprovedEmail;

// Styles with green/success theme
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
  color: "#2d6a4f",
  fontSize: "28px",
  fontWeight: "bold" as const,
  margin: "0 0 24px",
  lineHeight: "1.4",
  textAlign: "center" as const,
};

const h3 = {
  color: "#1b4332",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "0 0 12px",
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const successSection = {
  backgroundColor: "#d1f4e0",
  border: "2px solid #2d6a4f",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const successText = {
  color: "#1b4332",
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
};

const list = {
  margin: "0",
  padding: "0 0 0 20px",
};

const listItem = {
  color: "#1b4332",
  fontSize: "15px",
  lineHeight: "1.8",
  marginBottom: "8px",
};

const notesSection = {
  backgroundColor: "#f8f9fa",
  borderLeft: "4px solid #2d6a4f",
  padding: "16px 20px",
  margin: "24px 0",
  borderRadius: "4px",
};

const notesText = {
  color: "#495057",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  fontStyle: "italic" as const,
};

const detailsSection = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const detailText = {
  color: "#555555",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 8px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#2d6a4f",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const footer = {
  color: "#6c757d",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "32px",
  textAlign: "center" as const,
};
