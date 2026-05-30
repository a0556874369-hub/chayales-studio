import { NextResponse } from "next/server";
import { Resend } from "resend";

// ה-route חייב להיות דינמי - אחרת Next.js ינסה לאסוף page data בזמן build
// ואז Resend constructor יזרוק בגלל שאין API key
export const dynamic = "force-dynamic";

// ⚠️ Resend constructor זורק כש-API key חסר, אז מאתחלים lazy בתוך ה-handler
// (לא ברמת מודול) כדי שה-build לא ייכשל אם המפתח לא הוגדר עדיין

// פונקציית escape ל-HTML למניעת injection
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// תרגום ערכי הדרופדאון לתצוגה
const SERVICE_LABELS: Record<string, string> = {
  website: "אתר חדש",
  branding: "מיתוג מלא",
  ad: "מודעה / חומר שיווקי",
  "full-package": "חבילה מלאה - מיתוג + אתר",
  other: "אחר / לא בטוחה עדיין",
};

export async function POST(request: Request) {
  // בדיקה שה-API key מוגדר
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "שירות המייל לא מוגדר" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      name = "",
      email = "",
      phone = "",
      service = "",
      message = "",
    } = body;

    // ולידציה בצד השרת
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "שם הוא שדה חובה" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "מייל הוא שדה חובה" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "כתובת מייל לא תקינה" },
        { status: 400 }
      );
    }

    // הגנה מפני קלט ארוך מדי (spam protection)
    if (
      name.length > 200 ||
      email.length > 200 ||
      phone.length > 50 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "אחד השדות ארוך מדי" },
        { status: 400 }
      );
    }

    // הכנת תוכן המייל - escape של כל הקלט
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = phone ? escapeHtml(phone.trim()) : "";
    const safeService = service ? SERVICE_LABELS[service] || escapeHtml(service) : "";
    const safeMessage = message ? escapeHtml(message.trim()) : "";

    const htmlBody = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background: #f5f7f8; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
    <div style="background: linear-gradient(135deg, #2D8896 0%, #4DD8E5 100%); padding: 32px 24px; color: white;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 800;">פנייה חדשה מהאתר</h1>
      <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">חיהLES Studio</p>
    </div>
    <div style="padding: 32px 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; width: 100px; color: #666; font-weight: 600; vertical-align: top;">שם:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #111;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 600; vertical-align: top;">מייל:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #111;"><a href="mailto:${safeEmail}" style="color: #2D8896; text-decoration: none;" dir="ltr">${safeEmail}</a></td>
        </tr>
        ${safePhone ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 600; vertical-align: top;">טלפון:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #111;"><a href="tel:${safePhone.replace(/[^0-9+]/g, "")}" style="color: #2D8896; text-decoration: none;" dir="ltr">${safePhone}</a></td>
        </tr>` : ""}
        ${safeService ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 600; vertical-align: top;">סוג שירות:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #111;">${safeService}</td>
        </tr>` : ""}
      </table>
      ${safeMessage ? `
      <div style="margin-top: 24px;">
        <h3 style="font-size: 14px; color: #666; margin: 0 0 8px;">הודעה:</h3>
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; color: #111; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
      </div>` : ""}
    </div>
    <div style="background: #f9fafb; padding: 16px 24px; text-align: center; color: #999; font-size: 12px;">
      נשלח מטופס יצירת קשר באתר חיהLES Studio
    </div>
  </div>
</body>
</html>`.trim();

    // טקסט פלאט (לקליינטים שלא תומכים ב-HTML)
    const textBody = [
      `פנייה חדשה מהאתר - חיהLES Studio`,
      ``,
      `שם: ${name}`,
      `מייל: ${email}`,
      phone ? `טלפון: ${phone}` : "",
      service ? `סוג שירות: ${SERVICE_LABELS[service] || service}` : "",
      ``,
      message ? `הודעה:\n${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // שליחה דרך Resend - אתחול lazy רק כשבאמת צריך
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "חיהLES Studio <onboarding@resend.dev>",
      to: ["chayales123@gmail.com"],
      replyTo: email,
      subject: `פנייה חדשה מהאתר - ${name}`,
      html: htmlBody,
      text: textBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "שגיאה בשליחת המייל. נסי שוב מאוחר יותר." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "שגיאה בשרת. נסי שוב מאוחר יותר." },
      { status: 500 }
    );
  }
}
