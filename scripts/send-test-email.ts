// Sends one real email through Resend to check delivery end to end. Run with: npm run test:email
// Optional: pass a recipient (npm run test:email -- you@example.com). Defaults to the owner address.
import { emailConfig, sendEmail } from "../app/api/lead/email.ts";
import { CONTACT_EMAIL } from "../app/content/contact.ts";

const cfg = emailConfig();
const to = process.argv[2] || process.env.LEAD_NOTIFY_EMAIL || CONTACT_EMAIL;
console.log(`From: ${cfg.from}\nTo:   ${to}`);
const ok = await sendEmail(cfg, to, "Portfolio email test", "If you can read this, the Resend key and the sender domain work.", CONTACT_EMAIL);
console.log(ok ? "Accepted by Resend. Check the inbox (and spam)." : "FAILED: see the error above.");
process.exit(ok ? 0 : 1);
