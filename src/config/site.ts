/**
 * Site-wide config — canonical URL, identity, contact. Single source of
 * truth for SEO metadata, JSON-LD and the footer.
 */

export const SITE = {
  name: "Codroon",
  /** Canonical origin — keep consistent (non-www) everywhere. */
  url: "https://codroon.com",
  title: "AI Agent Development & MVP Studio | Dallas, TX | Codroon",
  description:
    "Codroon is a Dallas, TX AI-native software studio building AI agents, MVPs and custom software for founders, shipped in weeks. Book a free discovery call.",
  email: "info@codroon.com",
  calendly: "https://calendly.com/codroon-info/30min",
  /** TODO: real US phone number — omit from UI until it exists. */
  phone: null as string | null,
  address: {
    locality: "Dallas",
    region: "TX",
    country: "US",
    /** TODO: street address — omit from UI until it exists. */
    street: null as string | null,
  },
  /**
   * Every office, for the LocalBusiness schema. The first entry is the
   * head office and stays the primary `address`.
   *
   * TODO: both street addresses. Left null rather than filled with a
   * plausible string — a wrong NAP costs more in local ranking than a
   * missing one, and these render on /about as well as in schema.
   */
  offices: [
    {
      key: "usa",
      locality: "Dallas",
      region: "TX",
      country: "US",
      street: null as string | null,
      headOffice: true,
    },
    {
      key: "pakistan",
      locality: "Islamabad",
      region: null as string | null,
      country: "PK",
      street: null as string | null,
      headOffice: false,
    },
  ],
} as const;
