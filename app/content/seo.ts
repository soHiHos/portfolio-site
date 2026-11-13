import type { Metadata } from "next";
import { CONTACT_EMAIL, CONTACT_FACEBOOK, CONTACT_GITHUB, CONTACT_INSTAGRAM, CONTACT_LINKEDIN, CONTACT_WHATSAPP, SITE_URL } from "./contact";

// The site's title and descriptions: the layout's defaults and the home page's link preview
export const SITE_TITLE = "sohambuilds.in · Software development company in Raipur";
export const SITE_DESCRIPTION =
  "sohambuilds.in is a software development company in Raipur, building custom apps, websites and business automation for growing businesses across India.";
export const SHARE_DESCRIPTION = "Apps, websites, digitalisation, automation and analysis for growing businesses in Raipur and across India.";

// Link preview image: a static, small PNG (public/og.png, 1200×630, ~70 KB) so LinkedIn, Instagram, WhatsApp and
// others fetch it instantly instead of waiting on a generated image. Size and alt are stated so crawlers needn't guess.
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: SITE_TITLE };

// Page metadata with its own canonical and its own link preview (og:url included). Without openGraph/twitter here, a
// page inherits the layout's, so a shared link to any page would show the home page's title and description.

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", images: OG_IMAGE },
    twitter: { card: "summary_large_image", title, description, images: OG_IMAGE },
  };
}

// Who runs the site, for search engines and AI answer engines. Pages refer to these by @id.
export const PERSON_ID = `${SITE_URL}/#person`;
export const BUSINESS_ID = `${SITE_URL}/#business`;

const ADDRESS = { "@type": "PostalAddress", addressLocality: "Raipur", addressRegion: "Chhattisgarh", addressCountry: "IN" };
const SAME_AS = [CONTACT_LINKEDIN, CONTACT_GITHUB, CONTACT_INSTAGRAM, CONTACT_FACEBOOK].filter(Boolean);

export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "sohambuilds.in",
      alternateName: "Soham Builds",
      inLanguage: "en-IN",
      publisher: { "@id": BUSINESS_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Soham Kar",
      url: SITE_URL,
      jobTitle: "Founder",
      description: "Engineer in Raipur, India and founder of sohambuilds.in, a software studio for digitalisation, automation and analysis.",
      address: ADDRESS,
      email: `mailto:${CONTACT_EMAIL}`,
      sameAs: SAME_AS,
      worksFor: { "@id": BUSINESS_ID },
    },
    {
      "@type": "ProfessionalService",
      "@id": BUSINESS_ID,
      name: "sohambuilds.in",
      alternateName: "Soham Builds",
      url: SITE_URL,
      description: "Apps, websites and software for growing businesses in Raipur and across India: digitalisation, automation and analysis.",
      image: `${SITE_URL}${OG_IMAGE.url}`,
      address: ADDRESS,
      areaServed: { "@type": "Country", name: "India" },
      email: CONTACT_EMAIL,
      ...(CONTACT_WHATSAPP ? { telephone: `+${CONTACT_WHATSAPP}` } : {}),
      founder: { "@id": PERSON_ID },
      sameAs: SAME_AS,
    },
  ],
};

// JSON-LD as a script tag body; "<" escaped so the JSON can never close the script tag
export const jsonLdHtml = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
