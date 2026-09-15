import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

let initialized = false;

export function initGSAP(): boolean {
  if (typeof window === 'undefined') return false;
  if (initialized) return true;

  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase);

  // Custom eases per spec
  CustomEase.create('brand', '0.16, 1, 0.3, 1');
  CustomEase.create('brandInOut', '0.76, 0, 0.24, 1');

  initialized = true;
  return true;
}

if (typeof window !== 'undefined') {
  initGSAP();
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase };
