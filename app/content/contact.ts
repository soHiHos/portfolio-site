// Contact details, shared by client components and server code (the ask route)
// The live site's address: canonical links, the sitemap and structured data. It is the www host, where Vercel serves the
// site (the bare domain redirects there), so link previews and canonicals never point at a redirect
export const SITE_URL = "https://www.sohambuilds.in";
export const CONTACT_EMAIL = "sohamkar.work@gmail.com";
export const CONTACT_LINKEDIN = "https://www.linkedin.com/in/soham-kar-99b15844a/";
export const CONTACT_GITHUB = "https://github.com/soHiHos";
export const CONTACT_INSTAGRAM = "https://www.instagram.com/sohambuilds.in/";
// The CV PDF; the Download CV button asks for a name and email first (components/cv-download.tsx)
export const CV_PATH = "/cv-resume/SOHAM_KAR_cv_11-2026.pdf";
// The Facebook links only show while this is set.
export const CONTACT_FACEBOOK = "https://www.facebook.com/profile.php?id=61596471596161";
// Empty for now: your WhatsApp number with country code and digits only (for example 919876543210). The floating WhatsApp button shows once it is set.
export const CONTACT_WHATSAPP = "919926476658";

// Seller details printed in the estimate PDF footer once filled in. Leave a field empty until you have it (GSTIN and PAN
// are pending); empty fields are left out, so nothing unfinished is shown.
export const BUSINESS = { legalName: "", address: "", gstin: "", pan: "" };
