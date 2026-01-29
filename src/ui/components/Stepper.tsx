'use client';

import { Fragment } from 'react/jsx-runtime';
import { IconCheck } from '@tabler/icons-react';
import { Typography } from './Typography';

export interface Step {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  completed?: boolean;
  disabled?: boolean;
}

export interface StepperProps {
  steps: Step[];
  activeStep: number;
  alternativeLabel?: boolean;
  vertical?: boolean;
  onStepClick?: (stepIndex: number) => void;
  connectorWidth?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Stepper = ({
  steps,
  activeStep = 0,
  alternativeLabel = false,
  vertical = false,
  onStepClick,
  size = 'md'
}: StepperProps) => {
  const connectorWidth = {
    sm: 'w-0.5',
    md: 'w-0.75',
    lg: 'w-1'
  }

  const connectorHeight = {
    sm: 'h-0.5',
    md: 'h-0.75',
    lg: 'h-1'
  }

  const stepSize = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-10'
  }

  const iconSize = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6'
  }

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-4 w-full`}>
      {steps.map((step, idx) => {
        const isActive = idx === activeStep;
        const isCompleted = !!step.completed || idx < activeStep;
        const isDisabled = !!step.disabled;
        return (
          <Fragment key={idx}>
            <div className={`flex items-center ${alternativeLabel ? 'flex-col flex-1' : ''} gap-2 relative`}>
              <div
                className={`shrink-0 inline-flex items-center justify-center rounded-full border-2 ${stepSize[size]} transition-all duration-200
                  ${isActive ? 'border-primary-800 bg-primary-800 text-white' :
                    isCompleted ? 'border-primary-600 bg-primary-100 text-primary-800' :
                    isDisabled ? 'border-gray-medium bg-gray-light text-gray-medium cursor-not-allowed' :
                    'border-accent bg-white text-accent'}
                  ${onStepClick && !isDisabled ? 'cursor-pointer hover:border-primary-600' : 'cursor-not-allowed'}
                `}
                aria-current={isActive ? 'step' : undefined}
                aria-disabled={isDisabled}
                onClick={() => onStepClick && !isDisabled && onStepClick(idx)}
              >
                {step.icon ? (
                  <div className={`flex items-center justify-center ${iconSize[size]}`}>
                    {step.icon}
                  </div> 
                ) : isCompleted ? (
                  <IconCheck className={iconSize[size]} />
                ) : (
                  <Typography variant='h6' as='span' className={`${isActive ? 'text-white' : isDisabled ? 'text-gray-medium' : 'text-accent'}`}>{idx + 1}</Typography>
                )}
              </div>
              {/* Etiqueta y descripción */}
              <div className={`flex flex-col items-center gap-1`}>
                <Typography variant={isActive ? 'h6' : 'paragraph'} as='span' className={`${isActive ? 'text-primary-800' : isCompleted ? 'text-primary-600' : isDisabled ? 'text-gray-medium' : 'text-accent'}`}>{step.label}</Typography>
                {step.description && (
                  <Typography variant="caption" as='span'>{step.description}</Typography>
                )}
              </div>
            </div>
            {/* Línea de conexión */}
            {idx < steps.length - 1 && (
              <div
                aria-hidden="true"
                className={`
                  ${vertical ? `${connectorWidth[size]} h-8` : `${connectorHeight[size]} flex-1`}
                  ${isCompleted ? 'bg-primary-600' : 'bg-accent'}
                `}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;