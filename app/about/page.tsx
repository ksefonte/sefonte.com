import ContentWrapper from "../ui/contentWrapper";

export default function About() {
  return (
    <ContentWrapper
      title="About"
      content={
        <div className="space-y-4">
          <p className="text-lg text-zinc-700 dark:text-zinc-300 w-full">
            Ecommerce specialist, analyst and software developer. Having fun with an empty canvas.
          </p>
          <p className="font-extrabold text-2xl">
            timeline
          </p>
        </div>
      }
    />
  );
}
