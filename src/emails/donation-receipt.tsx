import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface DonationReceiptEmailProps {
  donorName: string;
  organizationName: string;
  projectTitle: string;
  amount: number;
  date: string;
  receiptId: string;
}

export const DonationReceiptEmail = ({
  donorName,
  organizationName,
  projectTitle,
  amount,
  date,
  receiptId,
}: DonationReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your generous donation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Your Donation!</Heading>
          <Text style={text}>Dear {donorName},</Text>
          <Text style={text}>
            Thank you for your generous contribution. Your donation makes a real
            difference in supporting {organizationName}.
          </Text>

          <Section style={detailsSection}>
            <Heading style={h2}>Donation Details</Heading>
            <Text style={detailText}>
              <strong>Receipt #:</strong> {receiptId}
            </Text>
            <Text style={detailText}>
              <strong>Date:</strong> {date}
            </Text>
            <Text style={detailText}>
              <strong>Organization:</strong> {organizationName}
            </Text>
            <Text style={detailText}>
              <strong>Project:</strong> {projectTitle}
            </Text>
            <Text style={detailText}>
              <strong>Amount:</strong> ${amount.toFixed(2)}
            </Text>
          </Section>

          <Text style={text}>
            Your donation receipt is attached to this email for your records.
          </Text>

          <Text style={footer}>
            With gratitude,
            <br />
            Pure Hearts Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default DonationReceiptEmail;

// Styles with green theme
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
};

const h2 = {
  color: "#2d6a4f",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "0 0 16px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const detailsSection = {
  backgroundColor: "#f1f8f4",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  border: "1px solid #95d5b2",
};

const detailText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "4px 0",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "32px",
  margin: "32px 0 0",
};
