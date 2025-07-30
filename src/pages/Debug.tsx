import { useEffect, useState } from 'react';
import { auth } from '@/lib/api';

export default function Debug() {
  const [status, setStatus] = useState<string>('Loading...');
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAuth = async () => {
      try {
        setStatus('Testing authentication...');
        console.log('Debug: Testing auth.getUser()');
        
        const user = await auth.getUser();
        console.log('Debug: Auth successful:', user);
        setUserData(user);
        setStatus('Authentication successful!');
      } catch (err) {
        console.error('Debug: Auth failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('Authentication failed');
      }
    };

    testAuth();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        {error && (
          <div className="text-red-500">
            <strong>Error:</strong> {error}
          </div>
        )}
        {userData && (
          <div className="text-green-500">
            <strong>User Data:</strong> {JSON.stringify(userData, null, 2)}
          </div>
        )}
        <div>
          <strong>Current URL:</strong> {window.location.href}
        </div>
        <div>
          <strong>Cookies:</strong> {document.cookie}
        </div>
      </div>
    </div>
  );
} 