/** Content + bento placement for the Solutions section. */

export const CALENDLY = "https://calendly.com/codroon-info/30min";

export type ServiceKey =
  | "saas"
  | "integration"
  | "automation"
  | "agents"
  | "apis";

export type Service = {
  key: ServiceKey;
  title: string;
  descriptor: string;
  /** desktop bento placement (lg+); base is single column */
  place: string;
  flagship?: boolean;
};

export const SERVICES: Service[] = [
  {
    key: "saas",
    title: "SaaS Development",
    descriptor: "Web, desktop & mobile apps, built to scale.",
    place: "lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-2",
    flagship: true,
  },
  {
    key: "agents",
    title: "AI Agents",
    descriptor: "Autonomous agents that plan, act, and get real work done.",
    place: "lg:col-start-6 lg:col-span-4 lg:row-start-1",
  },
  {
    key: "integration",
    title: "AI Integration",
    descriptor: "Embed LLMs like GPT, Claude, Gemini, and Llama right into your product.",
    place: "lg:col-start-10 lg:col-span-3 lg:row-start-1",
  },
  {
    key: "automation",
    title: "AI Automation",
    descriptor: "Automate your ops and workflows, end to end.",
    place: "lg:col-start-6 lg:col-span-3 lg:row-start-2",
  },
  {
    key: "apis",
    title: "Integrations & APIs",
    descriptor:
      "Connect your stack: payments, CRMs, comms. If it has an API, we integrate it.",
    place: "lg:col-start-9 lg:col-span-4 lg:row-start-2",
  },
];