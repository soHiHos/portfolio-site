import Link from "next/link";
import { PictureGlassCard } from "../components/ui/cards/picture-glass-card";

export default function WorkSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full border-black/20 mt-1 border-t text-center space-y-10 py-12">
        <PictureGlassCard
          image="/images/rever-home.png"
          caption="Rever Life ERP"
          summary="A full-stack ERP platform built for a wellness and distributor-based business, streamlining inventory, orders, payments, ledger management, and user administration. The project involved designing scalable backend architecture, authentication, cloud deployment, and cost-optimized infrastructure while providing valuable lessons in product development, client management, pricing, and real-world software adoption."
          link="https://reverlife.in/home"/>
        <PictureGlassCard
          image="/images/local-legends.png"
          caption="Local Legends"
          summary="A community-driven football platform designed to connect local players, teams, and organizers through match discovery, event management, and social engagement. The project explored how technology can strengthen grassroots sports by simplifying coordination, encouraging participation, and making local football more accessible for players and organizers."
          link="https://locallegends.co.in/home"/>
        <PictureGlassCard
          image="/images/co-daftar.png"
          caption="Co-Daftar"
          summary="Co-Daftar is a premium coworking space where Raipur's most driven entrepreneurs, freelancers, startups, and professionals come to do their best work. More than just an office, it is a thoughtfully designed environment that inspires productivity, collaboration, and innovation. With modern infrastructure, high-speed internet, comfortable workspaces, meeting rooms, and a vibrant community, Co-Daftar provides everything ambitious individuals and growing teams need to build, create, and thrive."
          link="https://codaftar.com/"/>
      </div>
    </section>
  );
}

