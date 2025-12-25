/**
 * @file LoadingSpinner.tsx
 * @description Reusable loading spinner
 */

export function LoadingSpinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}
