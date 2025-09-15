'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

// --- PROPS TYPE --- //
interface PremiumStepperProps {
  steps: { id: string; name: string; component: React.ReactNode }[];
  currentStep: number;
  onStepChange: (index: number) => void;
}

// --- MAIN COMPONENT --- //
export const Stepper: React.FC<PremiumStepperProps> = ({ steps, currentStep, onStepChange }) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && currentStep < steps.length - 1) {
        onStepChange(currentStep + 1);
      }
      if ((e.key === 'Backspace' || e.key === 'ArrowLeft') && currentStep > 0) {
        onStepChange(currentStep - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, onStepChange, steps.length]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* --- Step Indicators --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 mb-12">
        {steps.map((step, index) => (
          <StepNode key={step.id} index={index} currentStep={currentStep} onStepChange={onStepChange} totalSteps={steps.length}>
            {step.name}
          </StepNode>
        ))}
      </div>

      {/* --- Step Content --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {steps[currentStep].component}
        </motion.div>
      </AnimatePresence>

      {/* --- Navigation --- */}
      <div className="flex justify-around items-center mt-10 px-4">
        <NavButton onClick={() => onStepChange(currentStep - 1)} disabled={currentStep === 0}>
          חזור
        </NavButton>
        <NavButton onClick={() => onStepChange(currentStep + 1)} disabled={currentStep === steps.length - 1}>
          המשך
        </NavButton>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS --- //

const StepNode = ({ children, index, currentStep, onStepChange, totalSteps }: any) => {
  const status = currentStep > index ? 'completed' : currentStep === index ? 'active' : 'upcoming';

  return (
    <motion.div animate={status} className="relative flex flex-row-reverse md:flex-col items-center gap-4 cursor-pointer md:flex-1" onClick={() => onStepChange(index)}>
      {/* Circle + Icon */}
      <motion.div
        variants={circleVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-12 h-12 rounded-full border-2 flex items-center justify-center relative"
      >
        {status === 'completed' ? (
          <Check className="w-8 h-8 text-white" />
        ) : (
          <span className={`text-lg font-semibold ${status === 'active' ? 'text-olive' : 'text-gray-400'}`}>{index + 1}</span>
        )}
        {status === 'active' && (
          <motion.div className="absolute inset-0 rounded-full border-2 border-olive shadow-[0_0_15px_3px_rgba(112,130,56,0.6)]" 
            animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} />
        )}
      </motion.div>

      {/* Label */}
      <div className="md:mt-4 text-center">
        <motion.p variants={labelVariants} className="font-medium text-sm md:text-base">{children}</motion.p>
      </div>

      {/* Connector Line (Desktop only) */}
      {index < totalSteps - 1 && (
        <motion.div
          variants={lineVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block h-0.5 w-full absolute top-6 right-[calc(50%+2rem)]"
        />
      )}
    </motion.div>
  );
};

const NavButton = ({ children, ...props }: any) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-6 py-2 bg-green-700 text-white rounded-full font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
    {...props}
  >
    {children}
  </motion.button>
);

// --- ANIMATION VARIANTS --- //

const circleVariants = {
  upcoming: { backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' },
  active: { backgroundColor: '#FFFFFF', borderColor: '#708238' },
  completed: { backgroundColor: '#708238', borderColor: '#708238' },
};

const labelVariants = {
  upcoming: { color: '#6B7280' },
  active: { color: '#708238' },
  completed: { color: '#4B5563' },
};

const lineVariants = {
  upcoming: { backgroundColor: '#D1D5DB' },
  active: { backgroundColor: '#D1D5DB' },
  completed: { backgroundColor: '#708238' },
};