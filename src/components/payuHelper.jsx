export const loadPayUSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.bolt) {
      resolve(window.bolt);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://jssdk.payu.in/bolt/bolt.min.js'; 
    script.async = true;
    script.onload = () => {
      if (window.bolt) {
        resolve(window.bolt);
      } else {
        reject(new Error('PayU SDK loaded but bolt object not found'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PayU SDK'));
    document.body.appendChild(script);
  });
};

// Note: Hash generation and verification moved to backend functions for security