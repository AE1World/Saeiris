import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, destination, travelers, dates, message } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");

    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2A2420;">
        <div style="border-bottom: 2px solid #C8956C; padding-bottom: 16px; margin-bottom: 24px;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C8956C; margin: 0 0 4px;">Saeiris</p>
          <h2 style="font-size: 28px; font-weight: 300; margin: 0;">New Trip Inquiry</h2>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5; width: 140px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7A68;">Name</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">
              <strong>${name}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7A68;">Email</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">
              <a href="mailto:${email}" style="color: #C8956C;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7A68;">Destination</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">${destination || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7A68;">Travelers</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">${travelers || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7A68;">Dates</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F0EBE5;">${dates || "—"}</td>
          </tr>
          ${message ? `
          <tr>
            <td style="padding: 10px 0;" colspan="2">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7A68; display: block; margin-bottom: 8px;">Message</span>
              <p style="margin: 0; line-height: 1.7; color: #2A2420;">${message}</p>
            </td>
          </tr>` : ""}
        </table>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #F0EBE5;">
          <p style="font-size: 12px; color: #8A7A68; margin: 0;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Saeiris Inquiries <onboarding@resend.dev>",
        to: ["jveldman35@gmail.com"],
        reply_to: email,
        subject: `New Inquiry from ${name} — ${destination || "Saeiris"}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
