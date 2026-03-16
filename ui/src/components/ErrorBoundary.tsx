import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'An unexpected error occurred.';
      try {
        const parsedError = JSON.parse(this.state.error?.message || '');
        if (parsedError.error) {
          errorMessage = `Firebase Error: ${parsedError.error} (Operation: ${parsedError.operationType})`;
        }
      } catch {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="hud-panel p-8 max-w-md w-full text-center border-gaming-danger/40">
            <h2 className="text-2xl font-display font-bold text-gaming-danger mb-4 uppercase">System Error</h2>
            <p className="text-white/60 mb-6">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="glass-button px-6 py-2 bg-gaming-accent/20 text-gaming-accent border-gaming-accent/40 uppercase font-bold text-xs tracking-widest"
            >
              Restart System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
