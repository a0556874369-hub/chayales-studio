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
  branding: "מיתוג",
  website: "אתר",
  ad: "מודעה",
  "full-package": "חבילה מלאה",
  "not-sure": "עדיין לא בטוחים",
};

export async function POST(request: Request) {
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
      contact = "",
      contactType = "",
      service = "",
      message = "",
    } = body;

    // ולידציה בצד השרת
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "שם הוא שדה חובה" }, { status: 400 });
    }

    if (!contact || typeof contact !== "string" || !contact.trim()) {
      return NextResponse.json(
        { error: "טלפון או מייל הם שדה חובה" },
        { status: 400 }
      );
    }

    // ולידציה של מייל או טלפון
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim());
    const digitCount = contact.replace(/\D/g, "").length;
    const isPhone = digitCount >= 8 && /^[\d\s+\-()]+$/.test(contact.trim());

    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { error: "טלפון או מייל לא תקינים" },
        { status: 400 }
      );
    }

    // הגנה מפני קלט ארוך מדי (spam protection)
    if (
      name.length > 200 ||
      contact.length > 200 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "אחד השדות ארוך מדי" },
        { status: 400 }
      );
    }

    // הכנת תוכן המייל - escape של כל הקלט
    const safeName = escapeHtml(name.trim());
    const safeContact = escapeHtml(contact.trim());
    const contactLabel = isEmail ? "מייל" : "טלפון";
    const safeService = service ? SERVICE_LABELS[service] || escapeHtml(service) : "";
    const safeMessage = message ? escapeHtml(message.trim()) : "";

    // קישור ישיר ב-HTML של המייל - תלוי אם זה מייל או טלפון
    const contactLink = isEmail
      ? `<a href="mailto:${safeContact}" style="color: #2D8896; text-decoration: none;" dir="ltr">${safeContact}</a>`
      : `<a href="tel:${safeContact.replace(/[^0-9+]/g, "")}" style="color: #2D8896; text-decoration: none;" dir="ltr">${safeContact}</a>`;

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
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 600; vertical-align: top;">${contactLabel}:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #111;">${contactLink}</td>
        </tr>
        ${safeService ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 600; vertical-align: top;">צריכים:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #111;">${safeService}</td>
        </tr>` : ""}
      </table>
      ${safeMessage ? `
      <div style="margin-top: 24px;">
        <h3 style="font-size: 14px; color: #666; margin: 0 0 8px;">על העסק:</h3>
        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; color: #111; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
      </div>` : ""}
    </div>
    <div style="background: #f9fafb; padding: 16px 24px; text-align: center; color: #999; font-size: 12px;">
      נשלח מטופס יצירת קשר באתר חיהLES Studio
    </div>
  </div>
</body>
</html>`.trim();

    // טקסט פלאט
    const textBody = [
      `פנייה חדשה מהאתר - חיהLES Studio`,
      ``,
      `שם: ${name}`,
      `${contactLabel}: ${contact}`,
      service ? `צריכים: ${SERVICE_LABELS[service] || service}` : "",
      ``,
      message ? `על העסק:\n${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // שליחה דרך Resend
    // אם זה מייל - מגדירים replyTo כדי שתוכלי לענות ישירות
    const emailOptions: {
      from: string;
      to: string[];
      subject: string;
      html: string;
      text: string;
      replyTo?: string;
    } = {
      from: "חיהLES Studio <onboarding@resend.dev>",
      to: ["chayales123@gmail.com"],
      subject: `פנייה חדשה מהאתר - ${name}`,
      html: htmlBody,
      text: textBody,
    };

    if (isEmail) {
      emailOptions.replyTo = contact;
    }

    // אתחול lazy של Resend - רק כשבאמת צריך לשלוח
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send(emailOptions);

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
