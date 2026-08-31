"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'trial',
      name: '7 DAY FREE TRIAL',
      price: '₹0',
      period: 'for 7 days',
      description: 'After the 7-day trial: ₹299/month',
      usd: '~ $10 / month'
    },
    {
      id: '6_months',
      name: '6 MONTH PLAN',
      price: '₹1,699',
      period: '/ 6 months',
      usd: '~ $55'
    },
    {
      id: 'yearly',
      name: 'YEARLY PLAN',
      price: '₹3,199',
      period: '/ year',
      usd: '~ $100',
      popular: true
    }
  ];

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // In a real app, integrate with Stripe or Razorpay here
    alert('Redirecting to payment provider for plan authorization...');
  };

  return (
    <div className="container min-h-screen py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted text-lg">Choose the plan that fits your business.</p>
      </div>
      
      <div className="flex flex-col gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`card relative transition-transform hover:scale-[1.02] cursor-pointer ${plan.popular ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''}`}
            onClick={() => handleSubscribe(plan.id)}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                MOST POPULAR
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{plan.name}</h2>
              <div className="text-right">
                <div className="text-2xl font-bold">{plan.price} <span className="text-sm font-normal text-muted">{plan.period}</span></div>
                <div className="text-xs text-muted mt-1">{plan.usd}</div>
              </div>
            </div>
            
            {plan.description && (
              <p className="text-sm font-medium mb-6 text-primary">{plan.description}</p>
            )}
            
            <ul className="mb-8 flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" /> Unlimited reviews
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" /> Custom QR code
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" /> Private feedback inbox
              </li>
            </ul>
            
            <button className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
              {plan.id === 'trial' ? 'Start Free Trial' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>
      
      <p className="text-center text-xs text-muted mt-10">
        By subscribing, you authorize recurring payments. Cancel anytime before your trial ends to pay ₹0.
      </p>
    </div>
  );
}
