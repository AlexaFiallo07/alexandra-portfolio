'use client';

import { Component, type ReactNode } from 'react';

interface GlbErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface GlbErrorBoundaryState {
  failed: boolean;
}

/** Si un GLB no se puede cargar o animar, devolvemos la escena procedural. */
export default class GlbErrorBoundary extends Component<
  GlbErrorBoundaryProps,
  GlbErrorBoundaryState
> {
  state: GlbErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): GlbErrorBoundaryState {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
