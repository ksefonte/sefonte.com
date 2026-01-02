import ContentWrapper from "../../ui/contentWrapper";

export default function ProjectB() {
  return (
    <ContentWrapper
      title="Project B"
      content={
        <div className="space-y-4">
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            This is Project B. Add your project details here.
          </p>
        </div>
      }
    />
  );
}
