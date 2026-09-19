import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030814] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-4">🦦</div>
          <h2 className="text-xl font-bold text-sky-200 mb-2">The Arctic Waters are Resting</h2>
          <p className="text-sm text-sky-400/80 max-w-sm mb-6">
            Something unexpected occurred while rendering. Don't worry, your focus progress is safe.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-sky-950 font-bold text-xs shadow-lg transition-all"
          >
            Reload Sanctuary
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
