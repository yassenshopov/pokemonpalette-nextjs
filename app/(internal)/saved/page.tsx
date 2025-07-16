'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function SavedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page's saved tab
    router.replace('/profile?tab=saved');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Redirecting to your saved designs...</p>
      </div>
    </div>
  );
}
