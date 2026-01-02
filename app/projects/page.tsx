import ContentWrapper from "../ui/contentWrapper";

export default function Projects() {
  return (
    <ContentWrapper
      title="Projects"
      content={
        <div className="space-y-4">
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            This is the projects page. Add your projects here.
          </p>
        </div>
      }
    />
  );
}
