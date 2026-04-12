
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Une erreur s'est produite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Quelque chose s'est mal passé. Veuillez réessayer ou contacter le support si le problème persiste.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="bg-gray-100 p-3 rounded text-sm">
                <summary className="cursor-pointer font-medium">Détails de l'erreur</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            <Button onClick={this.handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
