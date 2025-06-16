import React, { useEffect, useRef, useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  description: string;
  payeeEmail?: string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, description, payeeEmail }) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!amount || !description) {
      setError('Invalid payment configuration');
      return;
    }

    const loadPayPalScript = async () => {
      try {
        setIsScriptLoading(true);
        setError(null);

        // Remove any existing PayPal script
        const existingScript = document.querySelector('script[src*="paypal"]');
        if (existingScript) {
          existingScript.remove();
        }

        // Clear the PayPal button container
        if (paypalRef.current) {
          paypalRef.current.innerHTML = '';
        }

        // Create and load new PayPal script
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=USD&components=buttons`;
        script.async = true;

        const scriptPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load PayPal script'));
        });

        document.body.appendChild(script);

        await scriptPromise;
        setIsScriptLoaded(true);

        // Create PayPal buttons
        if (!window.paypal || !paypalRef.current) {
          throw new Error('PayPal SDK not initialized');
        }

        const buttons = window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
          },
          createOrder: (_data: any, actions: any) => {
            const orderData = {
              purchase_units: [{
                amount: { 
                  value: amount.toFixed(2),
                  currency_code: 'USD'
                },
                description: description
              }]
            };

            if (payeeEmail) {
              orderData.purchase_units[0].payee = {
                email_address: payeeEmail
              };
            }

            return actions.order.create(orderData);
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture();
              alert(`Payment successful! Thank you, ${details.payer.name.given_name}!`);
            } catch (error) {
              console.error('Payment capture error:', error);
              setError('Failed to process payment. Please try again.');
            }
          },
          onError: (err: Error) => {
            console.error('PayPal button error:', err);
            setError('There was an error processing your payment. Please try again.');
          }
        });

        await buttons.render(paypalRef.current);
      } catch (error) {
        console.error('PayPal initialization error:', error);
        setError('Failed to initialize payment system. Please refresh and try again.');
      } finally {
        setIsScriptLoading(false);
      }
    };

    loadPayPalScript();

    // Cleanup function
    return () => {
      const script = document.querySelector('script[src*="paypal"]');
      if (script) {
        script.remove();
      }
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }
    };
  }, [amount, description, payeeEmail]);

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 text-red-700 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {isScriptLoading && (
        <div className="w-full h-[150px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0046be]"></div>
        </div>
      )}
      <div 
        ref={paypalRef}
        className={`w-full min-h-[150px] ${isScriptLoading ? 'hidden' : 'block'}`}
      />
    </div>
  );
};

export default PayPalButton;