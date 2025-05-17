import { useParams } from 'react-router-dom';
import { policies } from '../../data/policies';

type PolicyType = 'terms-of-use' | 'booking-policy' | 'privacy-policy';

export function PolicyPage() {
  const { policyType } = useParams<{ policyType: PolicyType }>();
  
  const getPolicyContent = () => {
    switch(policyType) {
      case 'terms-of-use':
        return policies.termsOfUse;
      case 'booking-policy':
        return policies.bookingPolicy;
      case 'privacy-policy':
        return policies.privacyPolicy;
      default:
        return null;
    }
  };

  const policy = getPolicyContent();

  if (!policy) {
    return <div>Policy not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{policy.title}</h1>
      <div className="space-y-6">
        {policy.content.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-navy mb-3">{item.section}</h2>
            <p className="text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}