import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

/**
 * A bug in the widget's own UI must never take down the host page it's
 * embedded on. This catches any render-time error from the wrapped widget
 * subtree and renders nothing instead of letting it propagate up through
 * the client's React tree. Only ever wrap the widget's own UI with this -
 * never wrap the client's `children`, since an error boundary discards its
 * entire subtree on catch and we must not risk hiding their actual page.
 */
class RoastnestErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error(
			"Roastnest widget encountered an error and was hidden to avoid affecting the host page:",
			error,
			info.componentStack,
		);
	}

	render() {
		if (this.state.hasError) return null;
		return this.props.children;
	}
}

export default RoastnestErrorBoundary;
