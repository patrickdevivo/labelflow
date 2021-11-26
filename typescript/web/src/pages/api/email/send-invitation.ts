import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";

import { generateHtml } from "../../../utils/email/templates/invitation";

type InvitationEmailInputs = {
  inviterName?: string;
  inviterEmail?: string;
  inviteeEmail: string;
  workspaceName: string;
  workspaceSlug: string;
  membershipId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    // Signed in
    const {
      query: {
        inviteeEmail,
        inviterEmail,
        inviterName,
        workspaceName,
        workspaceSlug,
        membershipId,
      },
    } = req as unknown as {
      query: InvitationEmailInputs;
    };
    const searchParams = new URLSearchParams({
      membershipId,
    });

    // We use the NEXTAUTH_URL on the production deployment only
    // Vercel_URL is different on each deployment (=== commit)
    const origin =
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      "https://labelflow.ai";
    const url = `${origin}/${workspaceSlug}/accept-invite?${searchParams.toString()}`;
    const transport = createTransport(process.env.EMAIL_SERVER ?? "");
    await transport.sendMail({
      to: inviteeEmail,
      from: process.env.EMAIL_FROM ?? "",
      subject: `Join ${workspaceName} on LabelFlow`,
      text: `Join ${workspaceName} on LabelFlow\n${url}\n\n`,
      html: generateHtml({
        inviterName: inviterName ?? undefined,
        inviterEmail: inviterEmail ?? undefined,
        url,
        origin,
        workspaceName: workspaceName ?? "undefined workspace",
        type: "invitation",
      }),
    });
    res.status(200);
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
