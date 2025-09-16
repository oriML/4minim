'use client';

import React, { useState } from 'react';
import { Stepper } from '@/ui/stepper/Stepper';
import { Step } from './Step'; // Import the new generic Step component
import { StepSummary } from './StepSummary';
import { Product } from '@/core/types';
import { ProductsByCategory } from '@/features/products/actions';

export interface CustomSet {
  lulav: Product | null;
  etrog: Product | null;
  hadas: Product | null;
  arava: Product | null;
}

interface CustomSetBuilderProps {
  productsByCategory: ProductsByCategory;
}

// Configuration for the product steps
const stepConfig: { category: keyof CustomSet; title: string; dbCategory: string; }[] = [
  { category: 'lulav', title: '1. בחר לולב', dbCategory: 'לולב' },
  { category: 'etrog', title: '2. בחר אתרוג', dbCategory: 'אתרוג' },
  { category: 'hadas', title: '3. בחר הדס', dbCategory: 'הדס' },
  { category: 'arava', title: '4. בחר ערבה', dbCategory: 'ערבה' },
];

export const CustomSetBuilder: React.FC<CustomSetBuilderProps> = ({ productsByCategory }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [customSet, setCustomSet] = useState<CustomSet>({ lulav: null, etrog: null, hadas: null, arava: null });

  const updateProductSelection = (category: keyof CustomSet, product: Product) => {
    setCustomSet(prev => ({
      ...prev,
      [category]: prev[category]?.id === product.id ? null : product
    }));
  };

  // Dynamically generate the steps from the config
  const productSteps = stepConfig.map(config => ({
    id: `step-${config.category}`,
    name: config.title.split('. ')[1],
    component: (
      <Step
        title={config.title}
        products={productsByCategory[config.dbCategory] || []}
        selected={customSet[config.category]}
        onSelect={(p) => updateProductSelection(config.category, p)}
      />
    ),
  }));

  const summaryStep = {
    id: 'step-summary',
    name: 'סיכום הזמנה',
    component: <StepSummary set={customSet} />
  };

  const steps = [...productSteps, summaryStep];

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
