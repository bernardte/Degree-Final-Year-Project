const LoadingSpinner = ({ message }: { message: string}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
