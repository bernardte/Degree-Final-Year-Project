import { Shield } from 'lucide-react';

const NoConversationSelected = () => {
  return (
    <div className="flex flex-grow flex-col items-center justify-center text-gray-400">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
        <Shield className="h-8 w-8 text-blue-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-500">
        Anonymous Guest Support
      </h3>
      <p className="mt-2 max-w-md text-center">
        Guests can chat anonymously about their hotel reservation. Select a
        conversation to begin.
      </p>
      <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <p>Admin cannot see guest personal information</p>
      </div>
    </div>
  );
}

export default NoConversationSelected
