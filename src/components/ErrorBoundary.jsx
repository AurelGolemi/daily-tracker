import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    // Clear localStorage and reload
    if (window.confirm('This will clear all your data and reload the app. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  handleRetry = () => {
    // Try to recover by resetting the error state
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Something went wrong</h1>
            </div>
            
            <p className="text-gray-600 mb-4">
              The application encountered an unexpected error. This might be due to corrupted data or a code issue.
            </p>
            
            {/* Error details for debugging */}
            <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-auto">
              <h3 className="font-semibold text-gray-800 mb-2">Error Details:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Stack Trace (click to expand)
                  </summary>
                  <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Data & Reload
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Just Reload
              </button>
            </div>

            {/* Debugging tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Debugging Tips:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check the browser console (F12) for more detailed error information</li>
                <li>• If the error persists, try "Clear Data & Reload" to reset the application</li>
                <li>• Make sure you're using a modern browser with JavaScript enabled</li>
                <li>• The error details above can help identify the specific issue</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// import React from 'react';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { 
//       hasError: false, 
//       error: null, 
//       errorInfo: null 
//     };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     this.setState({
//       error: error,
//       errorInfo: errorInfo
//     });
//     console.error('Error caught by boundary:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ 
//           padding: '20px', 
//           border: '1px solid #ff6b6b', 
//           background: '#ffe6e6',
//           margin: '20px',
//           borderRadius: '8px'
//         }}>
//           <h2 style={{ color: '#d63636' }}>Something went wrong with this component.</h2>
//           <details style={{ whiteSpace: 'pre-wrap', color: '#666' }}>
//             {this.state.error && this.state.error.toString()}
//             <br />
//             {this.state.errorInfo?.componentStack}
//           </details>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;