import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

type Props = { children: ReactNode; resetKey?: string };
type State = { failed: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("BloomBook recovered from a rendering error", error, info);
  }

  componentDidUpdate(previous: Props) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="min-h-[70vh] px-6 flex items-center justify-center" role="alert">
        <div className="diary-card rounded-[24px] p-8 text-center max-w-sm">
          <div className="text-4xl" aria-hidden="true">🌷</div>
          <h1 className="font-playfair text-2xl text-bloom-dark mt-3">This page lost its place</h1>
          <p className="font-lato text-sm text-bloom-soft mt-2">
            Your memories are safe. Refresh the page to pick up where you left off.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 min-h-11 px-5 rounded-full bg-bloom-pink-deep text-white inline-flex items-center gap-2"
          >
            <RefreshCw size={16} /> Refresh BloomBook
          </button>
        </div>
      </main>
    );
  }
}

