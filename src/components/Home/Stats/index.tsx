import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";

/**
 * Stats — full-bleed accent band, 4 stats in one row: large numeral
 * above a small label, evenly distributed. The brand sheet permits
 * orange as a surface (Secondary Logo 02); ALL text on it is #232220
 * (--accent-foreground) — light-on-orange fails contrast.
 *
 * Each numeral counts up on first scroll into view (client,
 * 2026-08-02) and settles on the sanctioned figure.
 *
 * These four figures are the only sanctioned numbers — do not add,
 * scale, or round others.
 */

const STATS = [
  { value: "100+", label: "projects delivered" },
  { value: "4", label: "products shipped" },
  { value: "$300K+", label: "revenue generated for clients" },
  { value: "500K+", label: "logins across our products" },
];

export function Stats() {
  return (
    <section className="bg-accent py-16 sm:py-20">
      <h2 className="sr-only">Codroon in numbers</h2>
      <Container width="wide">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {STATS.map((stat) => (
            <li key={stat.label} className="text-center">
              <span className="text-mono block text-4xl font-medium text-accent-foreground sm:text-5xl">
                <CountUp value={stat.value} />
              </span>
              <span className="mt-2 block text-[0.95rem] text-accent-foreground">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default Stats;
