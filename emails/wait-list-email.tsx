import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Link,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  Heading,
} from "@react-email/components";
import * as React from "react";

interface WaitListEmailProps {
  fullName: string;
  email: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const WaitListEmail = ({ fullName, email }: WaitListEmailProps) => (
  <Html>
    <Head>
      <title>WanderAI - You&apos;re on the wait list!</title>
      <Font
        fontFamily="Poppins"
        fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
        webFont={{
          url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>Plan your next trip in seconds with WanderAI</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            fontFamily: {
              sans: [
                "var(--font-geist-sans)",
                "Poppins",
                "Helvetica",
                "Arial",
                "sans-serif",
              ],
            },
            boxShadow: {
              light: "0 2px 4px 0px rgba(0, 0, 0, 0.04)",
              medium: "0 4px 12px 0px rgba(0, 0, 0, 0.08)",
              heavy: "0 4px 24px 0px rgba(0, 0, 0, 0.32)",
              top: "0 -4px 12px 0px rgba(0, 0, 0, 0.08)",
            },
          },
          colors: {
            black: "#201D23",
            gray: {
              100: "#F4F4F4",
              200: "#EAEAEA",
              300: "#D6D6D6",
              800: "#797979",
            },
            white: "#ffffff",
            green: {
              300: "#2EAD8C",
              400: "#35977D",
              500: "#347463",
            },
            red: {
              200: "#FE9AA4",
              300: "#FF7E8C",
            },
          },
        },
      }}
    >
      <Body className="bg-white font-sans">
        <Container className="mx-auto my-0 max-w-lg px-4">
          <Section className="pt-4">
            <Img
              src={`${baseUrl}/assets/logo.png`}
              width="156"
              height="32"
              alt="WanderAI Logo"
              className="mx-auto"
            />
            <Heading className="text-center text-2xl font-semibold text-black">
              You&apos;re on the wait list!
            </Heading>
          </Section>
          <Section>
            <Text className="text-black">Hi {fullName},</Text>
            <Text className="text-black">
              Thanks for joining the wait list! We&apos;re excited to have you on
              board.
            </Text>
            <Text className="text-black">
              We&apos;re working hard to bring you the best travel planning product
              on the market and will send you an email to{" "}
              <strong className="font-semibold">{email}</strong> as soon as
              we&apos;re able to set up an account for you.
            </Text>
            <Text className="text-black">
              In the meantime, feel free to check out our website to see what
              other trips you can plan with WanderAI or you can go to our page
              on{" "}
              <Link
                className="font-semibold text-green-400"
                href="https://www.producthunt.com/posts/wanderai-2"
              >
                Product Hunt
              </Link>{" "}
              to support us there.
            </Text>
            <Container>
              <Row>
                <Button
                  className="text-md mr-2 rounded-full bg-green-400 px-6 py-3 font-medium text-white hover:bg-green-300 active:bg-green-500"
                  href="https://wanderai.co.uk"
                >
                  Start planning
                </Button>
                <Button
                  className="text-md rounded-full bg-gray-200 px-6 py-3 font-medium text-black hover:bg-gray-100 active:bg-gray-300"
                  href="https://www.producthunt.com/posts/wanderai-2"
                >
                  Support us
                </Button>
              </Row>
            </Container>
          </Section>
          <Text className="text-black">
            All the Best,
            <br />
            <strong className="font-semibold">The WanderAI team</strong>
          </Text>
          <Section></Section>
          <Hr className="border border-gray-800" />
          <Text className="text-sm text-gray-800">Made in London with ❤️</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

WaitListEmail.PreviewProps = {
  fullName: "Alan",
  email: "alan@wanderai.co.uk",
} as WaitListEmailProps;

export default WaitListEmail;
