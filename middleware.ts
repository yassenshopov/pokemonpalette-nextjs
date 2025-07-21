import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect internal pages - match actual URL paths
    '/((?!_next/static|.*\\..*|api|trpc).*)',
    // Explicitly protect API routes
    '/(api|trpc)(.*)',
  ],
};
