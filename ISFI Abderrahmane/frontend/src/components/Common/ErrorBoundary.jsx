import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
            <div className="max-w-2xl w-full bg-card rounded-lg shadow-xl p-8 border border-border">
                <h1 className="text-3xl font-bold text-destructive mb-4">Oops! Something went wrong</h1>
                <p className="text-muted-foreground mb-6">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>
                
                <details className="mb-6">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground mb-2">Error Details</summary>
                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-64">
                        <p className="text-sm font-mono text-foreground mb-2">
                            <strong>Error:</strong> {this.state.error?.toString()}
                        </p>
                        {this.state.errorInfo && (
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                                {this.state.errorInfo.componentStack}
                            </pre>
                        )}
                    </div>
                </details>

                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Refresh Page
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="ml-4 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
