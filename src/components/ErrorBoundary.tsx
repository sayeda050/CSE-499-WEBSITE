
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  Props,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo,
  ): void {
    console.error("Frontend rendering failure", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error">
          <h1>The interface encountered an error.</h1>
          <p>
            The research model and original data were not
            changed. Reload the application to try again.
          </p>
          <button
            className="button button-primary"
            onClick={() => window.location.reload()}
          >
            Reload interface
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
