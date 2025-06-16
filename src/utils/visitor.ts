import axios from 'axios';
import UAParser from 'ua-parser-js';

export async function notifyVisitor() {
  try {
    // Get current domain
    const domain = window.location.hostname;

    // Get IP info first
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    const ip = ipResponse.data.ip;

    // Get location info
    const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
    
    // Get device info
    const parser = new UAParser();
    const result = parser.getResult();

    console.log('Visitor info:', {
      ip,
      domain,
      country: locationResponse.data.country_name || 'Unknown',
      device: {
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown',
        device: result.device.type || 'desktop'
      },
      timestamp: new Date().toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        dateStyle: 'short',
        timeStyle: 'short'
      })
    });

  } catch (error) {
    console.error('Failed to collect visitor info:', error);
  }
}