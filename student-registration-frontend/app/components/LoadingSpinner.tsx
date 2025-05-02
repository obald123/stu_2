interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  center?: boolean;
  fullHeight?: boolean;
}

export default function LoadingSpinner({ 
  size = 8, 
  color = 'red',
  center = false,
  fullHeight = false 
}: LoadingSpinnerProps) {
  const containerClasses = [
    'flex',
    center ? 'justify-center items-center' : '',
    fullHeight ? 'h-screen' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={containerClasses}
      data-testid="spinner-container"
    >
      <div
        data-testid="loading-spinner"
        className={`w-${size} h-${size} animate-spin text-${color}-500`}
        role="status"
        aria-label="Loading..."
        aria-busy="true"
      >
        <div className="border-4 border-current border-t-transparent rounded-full w-full h-full" />
      </div>
    </div>
  );
}
