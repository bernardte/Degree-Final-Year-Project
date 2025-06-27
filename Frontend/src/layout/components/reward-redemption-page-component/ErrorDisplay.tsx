interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="max-w-md rounded-xl bg-red-50 p-8 text-center">
        <div className="mb-4 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          Error Loading Rewards
        </h3>
        <p className="mb-6 text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
