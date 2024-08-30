import WaitListEmail from "@/emails/wait-list-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  console.log("sending email");
  const body = await request.json();
  console.log("body: ", body);
  const { fullName, email } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: "WanderAI <waitlist@wanderai.co.uk>",
      to: email,
      subject: "WanderAI | You're on the wait list!",
      react: WaitListEmail({ fullName: fullName, email: email }),
    });

    if (error) {
      console.error(error);
      return Response.json({ error }, { status: 500 });
    }
    console.log("email sent");

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
