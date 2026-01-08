import ContentWrapper from "../ui/contentWrapper";
import Timeline, { TimelineItem } from "../ui/Timeline"

// Sample changelog data - you can replace this with your actual data
const changelogItems: TimelineItem[] = [
  {
    id: 1,
    content: "Registered sefonte.com domain for fun",
    order: 1,
  },
  {
    id: 2,
    content: "Wanted to deploy something to AWS",
    order: 2,
  },
  {
    id: 3,
    content: "First iteration: single page with automatic expanding menu",
    order: 3,
  },
  {
    id: 4,
    content: "Integrated burger menu with smooth animations.",
    order: 4,
  },
  {
    id: 5,
    content: "Added this timeline component to visualise site evolution",
    order: 5,
  },
];

export default function About() {
  return (
    <ContentWrapper
      title="About"
      content={
        <div className="space-y-8">
          <p className="text-lg text-zinc-700 dark:text-zinc-300 w-full">
            Ecommerce specialist, analyst and software developer. Having fun with an empty canvas.
          </p>
          <div className="space-y-4">
            <p className="font-extrabold text-2xl">
              timeline
            </p>
            <Timeline items={changelogItems} />
          </div>
        </div>
      }
    />
  );
}
