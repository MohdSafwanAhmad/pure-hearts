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

interface VerificationRejectedEmailProps {
  organizationName: string;
  contactPersonName: string;
  reviewerName: string;
  adminNotes: string;
  attemptsRemaining: number;
  resubmitUrl?: string;
}

export const VerificationRejectedEmail = ({
  organizationName,
  contactPersonName,
  reviewerName,
  adminNotes,
  attemptsRemaining,
  resubmitUrl,
}: VerificationRejectedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Update needed for your verification request</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verification Request Update</Heading>
          
          <Text style={text}>Dear {contactPersonName},</Text>
          
          <Text style={text}>
            Thank you for submitting a verification request for <strong>{organizationName}</strong>.
            After careful review, we need additional information or corrections before we can 
            approve your verification.
          </Text>

          <Section style={notesSection}>
            <Heading style={h3}>Feedback from Reviewer</Heading>
            <Text style={notesText}>{adminNotes}</Text>
            <Text style={reviewerText}>
              — {reviewerName}
            </Text>
          </Section>

          <Section style={infoSection}>
            <Heading style={h3}>What&apos;s Next?</Heading>
            <Text style={infoText}>
              Please review the feedback above and prepare updated documentation 
              that addresses the concerns raised. Once you have the corrected documents 
              ready, you can submit a new verification request.
            </Text>
            {attemptsRemaining > 0 && (
              <Text style={attemptsText}>
                <strong>Attempts remaining:</strong> {attemptsRemaining} of 3
              </Text>
            )}
            {attemptsRemaining === 0 && (
              <Text style={warningText}>
                <strong>Important:</strong> You have used all 3 verification attempts. 
                You will be able to submit a new request after a 7-day cooldown period.
              </Text>
            )}
          </Section>

          {resubmitUrl && attemptsRemaining > 0 && (
            <Section style={buttonContainer}>
              <Button style={button} href={resubmitUrl}>
                Submit Updated Documents
              </Button>
            </Section>
          )}

          <Text style={footer}>
            If you have questions about this decision, please contact our support team.
            <br />
            <br />
            Pure Hearts Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationRejectedEmail;

// Styles with orange/warning theme
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
  textAlign: "center" as const,
};

const h3 = {
  color: "#9a3412",
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

const notesSection = {
  backgroundColor: "#fff7ed",
  border: "2px solid #fb923c",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const notesText = {
  color: "#9a3412",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 12px",
  whiteSpace: "pre-wrap" as const,
};

const reviewerText = {
  color: "#c2410c",
  fontSize: "14px",
  fontStyle: "italic" as const,
  margin: "0",
  textAlign: "right" as const,
};

const infoSection = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const infoText = {
  color: "#495057",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const attemptsText = {
  color: "#555555",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  padding: "12px",
  backgroundColor: "#e9ecef",
  borderRadius: "4px",
};

const warningText = {
  color: "#dc2626",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  padding: "12px",
  backgroundColor: "#fee2e2",
  borderRadius: "4px",
  border: "1px solid #fca5a5",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#ea580c",
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
