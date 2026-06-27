import React, { ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.retry);
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Something went wrong
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              {process.env.NODE_ENV === "development" && (
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32 text-gray-700">
                  {this.state.error?.stack}
                </pre>
              )}
              <Button
                onClick={this.retry}
                className="w-full gap-2"
                variant="default"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
