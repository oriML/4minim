'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
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

  // Effect to handle pre-selected products from localStorage
  useEffect(() => {
    console.log("CustomSetBuilder useEffect triggered.");
    const preselectedProductsJson = localStorage.getItem('preselectedSetProducts');
    console.log("preselectedProductsJson:", preselectedProductsJson);

    if (preselectedProductsJson) {
      try {
        const preselectedProductsMap: Record<string, { qty: number }> = JSON.parse(preselectedProductsJson);
        console.log("preselectedProductsMap:", preselectedProductsMap);
        
        // Fetch all products to map IDs to full Product objects
        getProductsAction().then(allProducts => {
          console.log("All products fetched:", allProducts);
          const newCustomSet: CustomSet = { lulav: null, etrog: null, hadas: null, arava: null };
          
          // Map product IDs from preselectedProductsMap to CustomSet categories
          Object.keys(preselectedProductsMap).forEach(productId => {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
              // Determine category based on product.category (dbCategory)
              const categoryKey = stepConfig.find(config => config.dbCategory === product.category)?.category;
              if (categoryKey) {
                newCustomSet[categoryKey] = product;
              }
            }
          });
          console.log("New custom set after mapping:", newCustomSet);
          setCustomSet(newCustomSet);
          console.log("stepConfig.length:", stepConfig.length);
          setCurrentStep(stepConfig.length); // Navigate to the summary step
          console.log("setCurrentStep called with:", stepConfig.length);
        }).catch(e => {
          console.error("Error fetching products in CustomSetBuilder:", e);
        });
      } catch (e) {
        console.error("Failed to parse preselectedSetProducts from localStorage", e);
      } finally {
        localStorage.removeItem('preselectedSetProducts'); // Clean up localStorage
        console.log("localStorage item 'preselectedSetProducts' removed.");
      }
    }
  }, []); // Run only once on mount

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
  console.log("Current steps array:", steps);
  console.log("Current currentStep state:", currentStep);

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
