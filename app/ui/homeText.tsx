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
      const splitHeader = new SplitText(headerRef.current, { type: "chars" });
      const splitSubHeader = new SplitText(subHeaderRef.current, { type: "chars" });
    }
  })

  return(
    <>
      <h1 ref={headerRef} className="text-6xl font-semibold leading-10 tracking-tight text-zinc-950 dark:text-zinc-50">
        {header}
      </h1>
      <h2 ref={subHeaderRef} className="text-3xl font-light leading-10 tracking-tight text-zinc-800 dark:text-zinc-50">
        {subHeader}
      </h2>
    </>
  )
}