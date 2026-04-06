"use client";

import React, { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.name || "Default"}] caught:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-6 rounded-3xl border border-red-50 bg-red-50/5 p-8 text-center ring-1 ring-red-100 ring-inset">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-red-100 ring-inset">
            <AlertCircle className="size-6 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-neutral-900">
              Something went wrong
              {this.props.name && <span className="text-neutral-400"> in {this.props.name}</span>}
            </h3>
            <p className="mx-auto max-w-sm text-sm font-medium text-neutral-500">
              We encountered an issue rendering this section. You can try refreshing or contact
              support if the problem persists.
            </p>
          </div>
          <Button
            onClick={() => this.setState({ hasError: false })}
            variant="outline"
            className="h-10 gap-2 rounded-xl border-neutral-200 px-6 text-sm font-bold shadow-sm transition-all hover:bg-white active:scale-95"
          >
            <RefreshCcw className="size-3.5" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
