import { HTTPError } from 'ky';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { useEffect, useState } from 'react';

export type ApiErrorProps = {
  error: Error;
};

export function ApiError({ error }: ApiErrorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const parseError = async () => {
      if (error instanceof HTTPError) {
        setTitle(`API Error (${error.response.status})`);

        try {
          const problemDetails = await error.response.clone().json();
          setMessage(
            `${problemDetails.title}: ${problemDetails.detail ?? 'Unknown Error'}`,
          );
        } catch {
          setMessage(
            `API responded with non-success status code: ${error.response.status}`,
          );
        }
      } else {
        setTitle('Error');
        setMessage('Unkown error.');
      }
    };

    parseError();
    setIsLoading(false);
  }, []);

  if (isLoading) return;

  return (
    <Alert className="w-96" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
