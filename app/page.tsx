import HomeText from "./ui/homeText";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] font-elms dark:bg-black">
      <main className="flex min-h-screen w-full max-w-full flex-col items-center justify-between py-32 px-16 bg-[#f7f7f7] dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mt-auto">
          <HomeText
            header="sefonte.com"
            subHeader="Home website for Kyle Sefonte"
          />
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        </div>
      </main>
    </div>
  );
}
