import ContentWrapper from "../ui/contentWrapper";

export default function About() {
  return (
    <ContentWrapper
      title="About"
      content={
        <div className="space-y-4">
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            This is the about page. Add your content here.
          </p>
        </div>
      }
    />
  );
}
