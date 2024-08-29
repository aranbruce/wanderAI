"use client";

import { useEffect } from "react";

import Section from "@/components/section";
import Error from "@/components/error";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <Section isHero>
          <Error />
        </Section>
      </body>
    </html>
  );
}
