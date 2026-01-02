import ContentWrapper from "../../ui/contentWrapper";

export default function ProjectA() {
  return (
    <ContentWrapper
      title="Project A"
      content={
        <div className="space-y-4">
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            This is Project A. Add your project details here.
          </p>
        </div>
      }
    />
  );
}
