import React, { useEffect, useRef, useState } from 'react';

const PayPalButton = ({ amount, description, payeeEmail }) => {
  const paypalRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let scriptElement = null;
    let buttonInstance = null;

    const loadPayPalScript = async () => {
      try {
        if (!amount || !description) {
          throw new Error('Invalid payment configuration');
        }

        // Remove any existing PayPal elements
        const existingScript = document.querySelector('script[src*="paypal"]');
        if (existingScript) {
          existingScript.remove();
        }

        if (paypalRef.current) {
          paypalRef.current.innerHTML = '';
        }

        // Create and load PayPal script
        scriptElement = document.createElement('script');
        scriptElement.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=USD&components=buttons`;
        scriptElement.async = true;

        const scriptPromise = new Promise((resolve, reject) => {
          scriptElement.onload = resolve;
          scriptElement.onerror = reject;
        });

        document.body.appendChild(scriptElement);
        await scriptPromise;

        if (!mounted || !window.paypal || !paypalRef.current) return;

        // Create PayPal buttons
        buttonInstance = window.paypal.Buttons({
          style: {
            layout: 'vertical',
            shape: 'rect',
            height: 55
          },
          createOrder: (data, actions) => {
            const orderData = {
              purchase_units: [{
                amount: { value: amount.toString() },
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
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            alert('✅ Payment successful! Thank you, ' + details.payer.name.given_name + '.');
          },
          onError: (err) => {
            console.error('PayPal button error:', err);
            if (mounted) {
              setError('There was an error processing your payment. Please try again.');
            }
          }
        });

        if (mounted && paypalRef.current) {
          await buttonInstance.render(paypalRef.current);
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('PayPal initialization error:', error);
        if (mounted) {
          setError('Failed to initialize payment system. Please refresh and try again.');
          setIsLoading(false);
        }
      }
    };

    loadPayPalScript();

    return () => {
      mounted = false;
      if (buttonInstance) {
        try {
          buttonInstance.close();
        } catch (err) {
          console.error('Error cleaning up PayPal button:', err);
        }
      }
      if (scriptElement) {
        scriptElement.remove();
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
      {isLoading && (
        <div className="w-full h-[150px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0046be]"></div>
        </div>
      )}
      <div 
        ref={paypalRef}
        className={`w-full min-h-[150px] ${isLoading ? 'hidden' : 'block'}`}
      />
    </div>
  );
};

export default PayPalButton;