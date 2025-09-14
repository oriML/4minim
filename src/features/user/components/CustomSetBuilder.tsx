'use client';

import React, { useState } from 'react';
import { Stepper } from '@/ui/stepper/Stepper';
import { StepLulav } from './StepLulav';
import { StepEtrog } from './StepEtrog';
import { StepHadas } from './StepHadas';
import { StepArava } from './StepArava';
import { StepSummary } from './StepSummary';
import { Product } from '@/core/types';

export interface CustomSet {
  lulav: Product | null;
  etrog: Product | null;
  hadas: Product | null;
  arava: Product | null;
}

export const CustomSetBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [customSet, setCustomSet] = useState<CustomSet>({   לולב: null, אתרוג: null, הדס: null, arava: null });

  const updateProductSelection = (category: keyof CustomSet, product: Product) => {
    setCustomSet(prev => ({
      ...prev,
      [category]: prev[category]?.id === product.id ? null : product
    }));
  };

  const steps = [
    { id: 'step-lulav', name: 'לולב', component: <StepLulav selected={customSet.lulav} onSelect={(p) => updateProductSelection('lulav', p)} /> },
    { id: 'step-etrog', name: 'אתרוג', component: <StepEtrog selected={customSet.אתרוג} onSelect={(p) => updateProductSelection('אתרוג', p)} /> },
    { id: 'step-hadas', name: 'הדס', component: <StepHadas selected={customSet.hadas} onSelect={(p) => updateProductSelection('hadas', p)} /> },
    { id: 'step-arava', name: 'ערבה', component: <StepArava selected={customSet.ערבה} onSelect={(p) => updateProductSelection('ערבה', p)} /> },
    { id: 'step-summary', name: 'סיכום הזמנה', component: <StepSummary set={customSet} /> }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-olive">בנה את הסט המותאם אישית שלך</h1>
      <Stepper 
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};