import HomeText from "./ui/homeText";
import SplitLayout from "./ui/splitLayout";

export default function Home() {
  const menuItems = [
    { name: "Github", url: "https://github.com/ksefonte" },
    { name: "Also Github", url: "https://github.com/ksefonte" },
    { name: "Yeah, still Github", url: "https://github.com/ksefonte" }
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-elms dark:bg-black">
      <SplitLayout
        leftContent={
          <HomeText
            header="sefonte.com"
            subHeader="Landing page for Kyle Sefonte"
          />
        }
        menuItems={menuItems}
      />
    </div>
  );
}
