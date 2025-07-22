import { useEffect } from 'react';
import useGoogleAdsTracking from 'hooks/useGoogleAdsTracking';

const GoogleAdsTracking = () => {
  const { gadsData } = useGoogleAdsTracking();

  useEffect(() => {
    // Log tracking data for debugging
    if (process.env.NODE_ENV === 'development' && gadsData) {
      console.log('Google Ads tracking data:', gadsData);
    }
  }, [gadsData]);

  return null;
};

export default GoogleAdsTracking;
