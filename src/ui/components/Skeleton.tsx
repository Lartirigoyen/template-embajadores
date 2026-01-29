'use client';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  //count?: number;
  //gap?: string;
}

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  //count = 1,
  //gap = '16px',
}: SkeletonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lycsa';
      case 'rectangular':
        return 'rounded-none';
      case 'text':
      default:
        return 'rounded-lycsa';
    }
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-wave';
      case 'none':
      default:
        return '';
    }
  };

  const getDefaultDimensions = () => {
    if (variant === 'circular') {
      return { width: width || 40, height: height || 40 };
    }
    if (variant === 'text') {
      return { width: width || '100%', height: height || 16 };
    }
    return { width: width || '100%', height: height || 100 };
  };

  const dimensions = getDefaultDimensions();

  return (
    <div
      className={`bg-gray-medium ${getVariantStyles()} ${getAnimationClass()}`}
      style={{
        width: typeof dimensions.width === 'number' ? `${dimensions.width}px` : dimensions.width,
        height: typeof dimensions.height === 'number' ? `${dimensions.height}px` : dimensions.height,
      }}
    />
  );

  // if (count === 1) {
  //   return skeletonElement;
  // }

  // return (
  //   <div className={`flex flex-col gap-${gap}`}>
  //     {Array.from({ length: count }).map((_, index) => (
  //       <div key={index}>{skeletonElement}</div>
  //     ))}
  //   </div>
  // );
};

export default Skeleton;