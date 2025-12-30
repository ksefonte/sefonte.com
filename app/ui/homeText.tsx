'use client'

import { gsap } from "gsap";
import { useRef, useEffect, JSX } from 'react';
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface HomeTextProps {
  header: string,
  subHeader: string
}

export default function HomeText ({ header, subHeader }: HomeTextProps): JSX.Element {
  const headerRef = useRef<HTMLHeadingElement>(null)
  const subHeaderRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (headerRef.current && subHeaderRef.current) {
      const splitHeader = new SplitText(headerRef.current, { type: "words" });
      const splitSubHeader = new SplitText(subHeaderRef.current, { type: "words" });
    }
  })

  return(
    <div className="flex flex-col lg:gap-2 gap-1 z-10">
      <h1 ref={headerRef} className="lg:text-6xl text-4xl font-semibold tracking-tight z-10 text-zinc-950 dark:text-zinc-50">
        {header}
      </h1>
      <h2 ref={subHeaderRef} className="lg:text-3xl text-2xl font-light tracking-tight text-zinc-800 dark:text-zinc-50">
        {subHeader}
      </h2>
    </div>
  )
}