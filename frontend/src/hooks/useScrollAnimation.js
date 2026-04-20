import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const elements = ref.current.querySelectorAll('[data-animate]');

      elements.forEach((element) => {
        const animationType = element.getAttribute('data-animate');
        const delay = parseFloat(element.getAttribute('data-delay') || '0');

        if (animationType === 'fade-in') {
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 0.5,
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay,
          });
        } else if (animationType === 'scale') {
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 0.5,
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            delay,
          });
        }
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
};
