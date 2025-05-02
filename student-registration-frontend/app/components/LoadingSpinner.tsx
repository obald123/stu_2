interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  center?: boolean;
  fullHeight?: boolean;
}

export default function LoadingSpinner({ 
  size = 40,
  color = '#4299e1',
  center = true,
  fullHeight = false 
}: LoadingSpinnerProps) {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: center ? 'center' : 'flex-start',
        alignItems: center ? 'center' : 'flex-start',
        height: fullHeight ? '100vh' : 'auto',
        width: '100%',
        padding: '20px'
      }}
      data-testid="loadingspinner-container"
      data-size={size}
      data-color={color}
      data-center={center}
      data-fullheight={fullHeight}
    >
      <div
        data-testid="loading-spinner"
        style={{
          width: size,
          height: size,
          animation: 'spin 1s linear infinite',
          position: 'relative'
        }}
        role="status"
        aria-label="Loading..."
        aria-busy="true"
      >
        <div 
          style={{
            border: `4px solid ${color}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            width: '100%',
            height: '100%',
            animation: 'spin 1s linear infinite'
          }} 
        />
      </div>
    </div>
  );
}
