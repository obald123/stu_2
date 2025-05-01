export default function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-8">
      <span
        className="animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
        style={{ width: size, height: size, display: 'inline-block' }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
