'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const isWhitelistError = error.message.includes('MongoDB Atlas IP whitelist');

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-destructive">
            {isWhitelistError ? 'Action Required: Configure Database Access' : 'Something Went Wrong'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isWhitelistError ? (
            <div>
              <CardDescription className="text-base">
                Your app cannot connect to MongoDB because your database is blocking it for security reasons.
              </CardDescription>
              <div className="mt-4 p-4 bg-muted rounded-md text-left">
                <p className="font-bold">To fix this, you must update your MongoDB Atlas settings:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Log in to your <a href="https://cloud.mongodb.com/" target="_blank" rel="noopener noreferrer" className="underline text-primary">MongoDB Atlas account</a>.</li>
                  <li>Go to <strong>Network Access</strong> in the security section.</li>
                  <li>Click <strong>Add IP Address</strong>.</li>
                  <li>Select <strong>Allow Access From Anywhere</strong> (which uses `0.0.0.0/0`).</li>
                  <li>Click <strong>Confirm</strong> and wait a moment for the change to apply.</li>
                </ol>
              </div>
            </div>
          ) : (
            <CardDescription>
              An unexpected error occurred. You can try again.
            </CardDescription>
          )}

          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
