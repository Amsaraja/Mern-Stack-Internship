import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Sparkles, Zap, Crown, AlertCircle, Loader } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubscription();
  }, [user, navigate]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/pay/subscription', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '5 blog posts per month',
        '10 AI suggestions per month',
        'Basic analytics',
        'Community support'
      ],
      icon: <Sparkles className="w-6 h-6" />,
      buttonText: 'Current Plan',
      buttonClass: 'btn-secondary cursor-not-allowed',
      popular: false,
      planKey: 'free'
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'per month',
      description: 'For serious bloggers',
      features: [
        'Unlimited blog posts',
        '100 AI suggestions per month',
        'Advanced analytics',
        'SEO optimization tools',
        'Priority support',
        'Custom domain'
      ],
      icon: <Zap className="w-6 h-6" />,
      buttonText: 'Upgrade to Pro',
      buttonClass: 'btn-primary',
      popular: true,
      planKey: 'pro'
    },
    {
      name: 'Premium',
      price: '$19',
      period: 'per month',
      description: 'For professional writers',
      features: [
        'Everything in Pro',
        '500 AI suggestions per month',
        'Advanced AI features',
        'White-label options',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ],
      icon: <Crown className="w-6 h-6" />,
      buttonText: 'Upgrade to Premium',
      buttonClass: 'btn-primary',
      popular: false,
      planKey: 'premium'
    }
  ];

  const handleSubscribe = async (planName) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (planName === 'Free') return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/pay/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: planName.toLowerCase() })
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/pay/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchSubscription();
        alert('Subscription will be cancelled at the end of your billing period.');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      setError('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlanButton = (plan) => {
    const isCurrentPlan = currentSubscription?.plan === plan.planKey;
    const isActive = currentSubscription?.status === 'active';
    const willCancel = currentSubscription?.cancelAtPeriodEnd;

    if (isCurrentPlan && isActive) {
      if (willCancel) {
        return (
          <div className="text-center">
            <div className="text-sm text-orange-600 mb-2">Cancels on {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</div>
            <button className="w-full py-3 rounded-lg font-medium bg-gray-200 text-gray-500 cursor-not-allowed">
              Current Plan
            </button>
          </div>
        );
      }
      return (
        <div className="space-y-2">
          <button className="w-full py-3 rounded-lg font-medium bg-green-100 text-green-700 cursor-not-allowed">
            Current Plan
          </button>
          {plan.planKey !== 'free' && (
            <button
              onClick={handleCancelSubscription}
              className="w-full py-2 text-sm text-red-600 hover:text-red-800"
              disabled={loading}
            >
              Cancel Subscription
            </button>
          )}
        </div>
      );
    }

    if (plan.planKey === 'free') {
      return (
        <button className="w-full py-3 rounded-lg font-medium bg-gray-200 text-gray-500 cursor-not-allowed">
          {plan.buttonText}
        </button>
      );
    }

    return (
      <button
        onClick={() => handleSubscribe(plan.name)}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${plan.buttonClass} flex items-center justify-center`}
        disabled={loading}
      >
        {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
        {plan.buttonText}
      </button>
    );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Helmet>
        <title>Subscription Plans - AI Blog Platform</title>
        <meta name="description" content="Choose the perfect plan for your blogging needs with AI-powered features" />
      </Helmet>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of AI-powered blogging with our flexible subscription plans
        </p>
        {currentSubscription && (
          <div className="mt-4 text-sm text-gray-600">
            Current Plan: <span className="font-semibold capitalize">{currentSubscription.plan}</span>
            {currentSubscription.currentPeriodEnd && (
              <span> • Renews on {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`card relative overflow-hidden ${
              plan.popular ? 'ring-2 ring-primary-500 shadow-xl' : ''
            } ${currentSubscription?.plan === plan.planKey ? 'ring-2 ring-green-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-primary-600 text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}
            
            {currentSubscription?.plan === plan.planKey && (
              <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-2 text-sm font-medium">
                Current Plan
              </div>
            )}
            
            <div className={`p-8 ${plan.popular || currentSubscription?.plan === plan.planKey ? 'pt-12' : ''}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
              </div>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {getCurrentPlanButton(plan)}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Can I change my plan anytime?</h3>
            <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">What happens to my AI usage?</h3>
            <p className="text-gray-600 text-sm">AI usage resets monthly. Unused requests don't roll over to the next month.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 text-sm">The Free plan gives you a taste of our features. You can upgrade anytime to access more advanced tools.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">How does billing work?</h3>
            <p className="text-gray-600 text-sm">All plans are billed monthly. You can cancel anytime and your subscription will remain active until the end of your billing period.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;