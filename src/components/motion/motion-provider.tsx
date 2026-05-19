"use client";

import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type MotionProviderProps = {
  children: React.ReactNode;
};

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateInteractiveButton(button: HTMLElement) {
  const enter = () => {
    gsap.to(button, {
      duration: 0.18,
      ease: "power2.out",
      scale: 1.02,
      y: -1,
    });
  };
  const leave = () => {
    gsap.to(button, {
      duration: 0.18,
      ease: "power2.out",
      scale: 1,
      y: 0,
    });
  };
  const press = () => {
    gsap.to(button, {
      duration: 0.12,
      ease: "power2.out",
      scale: 0.98,
      y: 0,
    });
  };

  button.addEventListener("pointerenter", enter);
  button.addEventListener("pointerleave", leave);
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", enter);
  button.addEventListener("blur", leave);

  return () => {
    button.removeEventListener("pointerenter", enter);
    button.removeEventListener("pointerleave", leave);
    button.removeEventListener("pointerdown", press);
    button.removeEventListener("pointerup", enter);
    button.removeEventListener("blur", leave);
  };
}

function hasLoadingContent(root: HTMLElement) {
  return Boolean(root.querySelector("[data-motion-loading]"));
}

export function MotionProvider({ children }: MotionProviderProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || shouldReduceMotion()) {
      return;
    }

    const cleanups: Array<() => void> = [];
    let context: gsap.Context | null = null;
    let observer: MutationObserver | null = null;
    let hasAnimatedContent = false;

    const animateContent = () => {
      if (hasAnimatedContent || hasLoadingContent(root)) {
        return;
      }

      hasAnimatedContent = true;
      context = gsap.context(() => {
      const header = root.querySelector<HTMLElement>(
        "[data-motion='site-header']",
      );
      const sections = gsap.utils.toArray<HTMLElement>(
        "[data-motion='page-section'], main > section",
        root,
      );
      const cards = gsap.utils
        .toArray<HTMLElement>("[data-motion='card']", root)
        .slice(0, 24);
      const buttons = gsap.utils
        .toArray<HTMLElement>("[data-slot='button']", root)
        .filter((button) => !button.hasAttribute("disabled"));

      if (header) {
        gsap.fromTo(
          header,
          { autoAlpha: 0, y: -10 },
          {
            autoAlpha: 1,
            clearProps: "transform,opacity,visibility",
            duration: 0.42,
            ease: "power2.out",
            y: 0,
          },
        );
      }

      if (sections.length > 0) {
        gsap.fromTo(
          sections,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            clearProps: "transform,opacity,visibility",
            delay: 0.04,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.06,
            y: 0,
          },
        );
      }

      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            clearProps: "transform,opacity,visibility",
            delay: 0.16,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.05,
            y: 0,
          },
        );
      }

      buttons.forEach((button) => {
        gsap.set(button, { transformOrigin: "50% 50%" });
        cleanups.push(animateInteractiveButton(button));
      });
      }, root);
    };

    const scheduleAnimation = () => {
      window.requestAnimationFrame(animateContent);
    };

    if (hasLoadingContent(root)) {
      observer = new MutationObserver(() => {
        if (!hasLoadingContent(root)) {
          scheduleAnimation();
          observer?.disconnect();
          observer = null;
        }
      });
      observer.observe(root, { childList: true, subtree: true });
    } else {
      scheduleAnimation();
    }

    return () => {
      observer?.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      context?.revert();
    };
  }, [pathname]);

  return <div ref={rootRef}>{children}</div>;
}
