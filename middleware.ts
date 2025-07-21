import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/(internal)(.*)', // Only protect internal pages
    '/(api|trpc)(.*)', // Protect API routes
  ],
};
