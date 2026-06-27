/**
 * Accessibility utilities for keyboard navigation and screen readers
 */

export function handleKeyDown(
  e: React.KeyboardEvent,
  handlers: {
    Enter?: () => void;
    Escape?: () => void;
    Space?: () => void;
    ArrowUp?: () => void;
    ArrowDown?: () => void;
    ArrowLeft?: () => void;
    ArrowRight?: () => void;
  }
) {
  const key = e.key;

  if (key === "Enter" && handlers.Enter) {
    e.preventDefault();
    handlers.Enter();
  } else if (key === "Escape" && handlers.Escape) {
    e.preventDefault();
    handlers.Escape();
  } else if (key === " " && handlers.Space) {
    e.preventDefault();
    handlers.Space();
  } else if (key === "ArrowUp" && handlers.ArrowUp) {
    e.preventDefault();
    handlers.ArrowUp();
  } else if (key === "ArrowDown" && handlers.ArrowDown) {
    e.preventDefault();
    handlers.ArrowDown();
  } else if (key === "ArrowLeft" && handlers.ArrowLeft) {
    e.preventDefault();
    handlers.ArrowLeft();
  } else if (key === "ArrowRight" && handlers.ArrowRight) {
    e.preventDefault();
    handlers.ArrowRight();
  }
}

export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  // Create a temporary live region for screen reader announcements
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

export function createAriaLabel(base: string, state?: string, count?: number): string {
  if (count !== undefined) {
    return `${base}, ${count}`;
  }
  if (state) {
    return `${base}, ${state}`;
  }
  return base;
}

/**
 * Prefers reduced motion preference
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
