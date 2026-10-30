import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import organizations from "../content/organizations.json";

type Organization = {
  id: string
  name: string
  logo?: string // path in /public; a generic placeholder logo shows until it is set
  logoBg?: string // circle colour behind a logo that has its own solid background, so the two blend
  status: "current" | "contract" | "partner" | "past"
  role?: string
  link?: string
}

const STATUS_LABEL = { current: "Current", contract: "Contract", partner: "Partner", past: "Past" }

// Organizations I've worked with or am contracting for, as a row of logo cards.
export default function OrganizationsSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <SectionHeading title="Collaborators" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(organizations as Organization[]).map((org, i) => {
            const Wrapper = org.link ? "a" : "div"
            return (
              <Reveal key={org.id} delay={i * 100}>
                <Wrapper
                  {...(org.link ? { href: org.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 border border-line bg-surface p-4 transition-colors duration-300 hover:border-accent/50"
                >
                  <span
                    className="flex w-12 h-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-bg"
                    style={org.logoBg ? { backgroundColor: org.logoBg } : undefined}
                  >
                    <img src={org.logo ?? "/logos/placeholder.svg"} alt={`${org.name} logo`} className={`${org.logoBg ? "w-[86%] h-[86%]" : "w-[62%] h-[62%]"} object-contain`} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-fg group-hover:text-accent-ink transition-colors">{org.name}</h3>
                    <p className="text-sm text-muted truncate">
                      {STATUS_LABEL[org.status]}{org.role && ` · ${org.role}`}
                    </p>
                  </div>
                </Wrapper>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  );
}
