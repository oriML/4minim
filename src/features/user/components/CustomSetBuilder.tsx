'use client';

import React, { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import { Stepper } from '@/ui/stepper/Stepper';
import { Step } from './Step';
import { StepSummary } from './StepSummary';
import { Product } from '@/core/types';
import { ProductsByCategory } from '@/features/products/actions';
import { getProductsAction } from '@/features/products/actions'; // Import getProductsAction

export interface CustomSet {
  lulav: Product | null;
  etrog: Product | null;
  hadas: Product | null;
  arava: Product | null;
}

interface CustomSetBuilderProps {
  productsByCategory: ProductsByCategory;
  preselectedSetProducts: Product[] | null;
  setId: string | null;
  setPrice: number | undefined;
}

// Configuration for the product steps
const stepConfig: { category: keyof CustomSet; title: string; dbCategory: string; }[] = [
  { category: 'lulav', title: '1. בחר לולב', dbCategory: 'לולב' },
  { category: 'etrog', title: '2. בחר אתרוג', dbCategory: 'אתרוג' },
  { category: 'hadas', title: '3. בחר הדס', dbCategory: 'הדס' },
  { category: 'arava', title: '4. בחר ערבה', dbCategory: 'ערבה' },
];

export const CustomSetBuilder: React.FC<CustomSetBuilderProps> = ({ productsByCategory, preselectedSetProducts, setId, setPrice }) => {
  console.log("CustomSetBuilder rendered with props:", { productsByCategory, preselectedSetProducts, setId, setPrice });
  const [currentStep, setCurrentStep] = useState(0);
  const [customSet, setCustomSet] = useState<CustomSet>({ lulav: null, etrog: null, hadas: null, arava: null });
  const [currentTotalPrice, setCurrentTotalPrice] = useState<number>(setPrice || 0);
  const hasUserModifiedSet = useRef(false);

  // Effect to handle pre-selected products from props
  useEffect(() => {
    console.log("CustomSetBuilder useEffect [preselectedSetProducts]: running");
    if (preselectedSetProducts && preselectedSetProducts.length > 0) {
      console.log("CustomSetBuilder useEffect [preselectedSetProducts]: preselectedSetProducts found", preselectedSetProducts);
      const newCustomSet: CustomSet = { lulav: null, etrog: null, hadas: null, arava: null };
      preselectedSetProducts.forEach(product => {
        const categoryKey = stepConfig.find(config => config.dbCategory === product.category)?.category;
        if (categoryKey) {
          newCustomSet[categoryKey] = product;
        }
      });
      console.log("CustomSetBuilder useEffect [preselectedSetProducts]: newCustomSet created", newCustomSet);
      setCustomSet(newCustomSet);
      setCurrentStep(stepConfig.length); // Navigate to the summary step
      // Do NOT set hasUserModifiedSet to true here, as the user hasn't modified anything yet.
    }
  }, [preselectedSetProducts]); // Rerun when preselectedSetProducts changes

  // Effect to recalculate total price whenever customSet changes
  useEffect(() => {
    console.log("CustomSetBuilder useEffect [customSet]: running");
    if (hasUserModifiedSet.current || !setPrice) { // Recalculate if user modified, or if no initial set price was provided
      console.log("CustomSetBuilder useEffect [customSet]: Recalculating price");
      const newTotal = Object.values(customSet).reduce((acc, product) => acc + (product?.price || 0), 0);
      setCurrentTotalPrice(newTotal);
      console.log("CustomSetBuilder useEffect [customSet]: newTotal", newTotal);
    } else {
      console.log("CustomSetBuilder useEffect [customSet]: Skipping price recalculation, using initial set price");
      // If setPrice was provided and user hasn't modified, keep the initial set price
      setCurrentTotalPrice(setPrice);
    }
  }, [customSet, setPrice]); // Depend on customSet and setPrice

  const updateProductSelection = (category: keyof CustomSet, product: Product) => {
    hasUserModifiedSet.current = true; // User has now modified the set
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
    component: <StepSummary set={customSet} setId={setId} currentTotalPrice={currentTotalPrice} />
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
