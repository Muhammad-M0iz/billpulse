import { useQuery } from '@tanstack/react-query';
import { getPlansOptions } from '../client/@tanstack/react-query.gen';
import type { PlanResponse, FeatureResponse } from '../client';

export function PlansList() {
  const { data: response, isLoading, isError, error } = useQuery({
    ...getPlansOptions(),
  });

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading plans...</div>;
  }

  if (isError) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error loading plans: {error?.message}
      </div>
    );
  }

  const plans = response?.data || [];

  if (plans.length === 0) {
    return <div style={{ padding: '20px' }}>No plans available.</div>;
  }

  console.log("API Response:", response)

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h2>Available Subscription Plans</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '16px',
        }}
      >
        {plans.map((plan: PlanResponse) => (
          <div
            key={plan.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{plan.name}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 16px 0', color: '#2563eb' }}>
              ${plan.monthly_fee} <span style={{ fontSize: '0.875rem', color: '#64748b' }}>/ month</span>
            </p>

            <h4 style={{ margin: '16px 0 8px 0', fontSize: '0.875rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Included Features
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {plan.features?.map((feature: FeatureResponse) => (
                <li key={feature.id} style={{ marginBottom: '6px', fontSize: '0.9rem' }}>
                  <strong>{feature.name}</strong> ({feature.max_unit_limit} units included)
                  <br />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Overuse: ${feature.unit_price} / extra unit
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
