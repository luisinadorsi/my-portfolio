type CircleProps = {
  color: string;
  size: number;
  opacity?: number;
  className?: string;
  delay?: number;
};

export default function Circle({
  color,
  size,
  opacity = 0.25,
  className = '',
  delay = 0,
}: CircleProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
        animation: `circleFloat 7s ease-in-out ${delay}ms infinite`,
      }}
    />
  );
}
