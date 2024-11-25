import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
  color?: string;
  position?: 'top' | 'right' | 'bottom';
}
const LOCATION_COLORS = {
  PRODUCTION: '#FFFFFF', // White for Production & Distribution
  DISTRIBUTION: '#1AA3E8', // Blue for Distribution
  SATELLITE: '#A020F0', // Gray for Satellite Offices
  CLIENT: '#FFD700', // Yellow for Clients & Dealers (default)
};

const Legend = () => (
  <div className="b-globe-legend">
    <ul className="b-globe-legend__list">
      <li className="b-globe-legend__item">
        <span
          className="b-globe-legend__color-box"
          style={{ backgroundColor: LOCATION_COLORS.PRODUCTION }}
        ></span>
        Production & Distribution
      </li>
      <li className="b-globe-legend__item">
        <span
          className="b-globe-legend__color-box"
          style={{ backgroundColor: LOCATION_COLORS.DISTRIBUTION }}
        ></span>
        Distribution
      </li>
      <li className="b-globe-legend__item">
        <span
          className="b-globe-legend__color-box"
          style={{ backgroundColor: LOCATION_COLORS.SATELLITE }}
        ></span>
        Satellite Offices
      </li>
      <li className="b-globe-legend__item">
        <span
          className="b-globe-legend__color-box"
          style={{ backgroundColor: LOCATION_COLORS.CLIENT }}
        ></span>
        Clients & Dealers
      </li>
    </ul>
  </div>
);

const GlobeComponent: React.FC = () => {
  const locations: Location[] = [
    {
      name: 'Afghanistan',
      lat: 33.9391,
      lng: 67.71,
    },
    {
      name: 'Algeria',
      lat: 28.0339,
      lng: 1.6596,
    },
    {
      name: 'Angola',
      lat: -11.2027,
      lng: 17.8739,
    },
    {
      name: 'Aruba',
      lat: 12.5211,
      lng: -69.9683,
    },
    {
      name: 'Azerbaijan',
      lat: 40.1431,
      lng: 47.5769,
    },
    {
      name: 'Bahamas',
      lat: 25.0343,
      lng: -77.3963,
      position: 'top',
    },
    {
      name: 'Barbados',
      lat: 13.1939,
      lng: -59.5432,
    },
    {
      name: 'Benin',
      lat: 9.3077,
      lng: 2.3158,
    },
    {
      name: 'Bolivia',
      lat: -16.2902,
      lng: -63.5887,
    },
    {
      name: 'Bosnia and Herzegovina',
      lat: 43.9159,
      lng: 17.6791,
    },
    {
      name: 'Brazil',
      lat: -14.235,
      lng: -51.9253,
    },
    {
      name: 'Burkina Faso',
      lat: 12.2383,
      lng: -1.5616,
    },
    {
      name: 'Burundi',
      lat: -3.3731,
      lng: 29.9189,
    },
    {
      name: 'Cambodia',
      lat: 12.5657,
      lng: 104.991,
    },
    {
      name: 'Chile',
      lat: -35.6751,
      lng: -71.543,
    },
    {
      name: 'China',
      lat: 35.8617,
      lng: 104.1954,
    },
    {
      name: 'Colombia',
      lat: 4.5709,
      lng: -74.2973,
    },
    {
      name: 'Congo [DRC]',
      lat: -4.0383,
      lng: 21.7587,
    },
    {
      name: 'Congo [Republic]',
      lat: -0.228,
      lng: 15.8277,
    },
    {
      name: "Cote d'Ivoire",
      lat: 7.54,
      lng: -5.5471,
      position: 'top',
    },
    {
      name: 'Cyprus',
      lat: 35.1264,
      lng: 33.4299,
    },
    {
      name: 'Djibouti',
      lat: 11.8251,
      lng: 42.5903,
    },
    {
      name: 'Dominican Republic',
      lat: 18.7357,
      lng: -70.1627,
    },
    {
      name: 'Ecuador',
      lat: -1.8312,
      lng: -78.1834,
    },
    {
      name: 'Egypt',
      lat: 26.8206,
      lng: 30.8025,
    },
    {
      name: 'Equatorial Guinea',
      lat: 1.6508,
      lng: 10.2679,
    },
    {
      name: 'Georgia',
      lat: 42.3154,
      lng: 43.3569,
    },
    {
      name: 'Germany',
      lat: 51.1657,
      lng: 10.4515,
    },
    {
      name: 'Ghana',
      lat: 7.9465,
      lng: -1.0232,
    },
    {
      name: 'Greece',
      lat: 39.0742,
      lng: 21.8243,
    },
    {
      name: 'Guatemala',
      lat: 15.7835,
      lng: -90.2308,
    },
    {
      name: 'Haiti',
      lat: 18.9712,
      lng: -72.2852,
      position: 'top',
    },
    {
      name: 'Hong Kong',
      lat: 22.3964,
      lng: 114.1095,
    },
    {
      name: 'Indonesia',
      lat: -0.7893,
      lng: 113.9213,
    },
    {
      name: 'Iraq',
      lat: 33.2232,
      lng: 43.6793,
    },
    {
      name: 'Israel',
      lat: 31.0461,
      lng: 34.8516,
    },
    {
      name: 'Italy',
      lat: 41.8719,
      lng: 12.5674,
    },
    {
      name: 'Jamaica',
      lat: 18.1096,
      lng: -77.2975,
      position: 'bottom',
    },
    {
      name: 'Jordan',
      lat: 30.5852,
      lng: 36.2384,
      position: 'bottom',
    },
    {
      name: 'Kazakhstan',
      lat: 48.0196,
      lng: 66.9237,
    },
    {
      name: 'Kenya',
      lat: -0.0236,
      lng: 37.9062,
    },
    {
      name: 'Kosovo',
      lat: 42.6026,
      lng: 20.903,
    },
    {
      name: 'Kuwait',
      lat: 29.3117,
      lng: 47.4818,
    },
    {
      name: 'Laos',
      lat: 19.8563,
      lng: 102.4955,
    },
    {
      name: 'Lebanon',
      lat: 33.8547,
      lng: 35.8623,
    },
    {
      name: 'Liberia',
      lat: 6.4281,
      lng: -9.4295,
      position: 'bottom',
    },
    {
      name: 'Malaysia',
      lat: 4.2105,
      lng: 101.9758,
    },
    {
      name: 'Mali',
      lat: 17.5707,
      lng: -3.9962,
    },
    {
      name: 'Malta',
      lat: 35.9375,
      lng: 14.3754,
    },
    {
      name: 'Mexico',
      lat: 23.6345,
      lng: -102.5528,
    },
    {
      name: 'Mozambique',
      lat: -18.6657,
      lng: 35.5296,
    },
    {
      name: 'Niger',
      lat: 17.6078,
      lng: 8.0817,
    },
    {
      name: 'Nigeria',
      lat: 9.082,
      lng: 8.6753,
    },
    {
      name: 'Oman',
      lat: 21.5126,
      lng: 55.9233,
    },
    {
      name: 'Pakistan',
      lat: 30.3753,
      lng: 69.3451,
    },
    {
      name: 'Panama',
      lat: 8.538,
      lng: -80.7821,
    },
    {
      name: 'Papua New Guinea',
      lat: -6.315,
      lng: 143.9555,
    },
    {
      name: 'Peru',
      lat: -9.19,
      lng: -75.0152,
    },
    {
      name: 'Qatar',
      lat: 25.3548,
      lng: 51.1839,
      description: 'Alpine Armoring International Office',
      color: '#A020F0',
    },
    {
      name: 'Saint Martin',
      lat: 18.0753,
      lng: -63.06,
      position: 'bottom',
    },
    {
      name: 'Saudi Arabia',
      lat: 23.8859,
      lng: 45.0792,
    },
    {
      name: 'Senegal',
      lat: 14.4974,
      lng: -14.4524,
    },
    {
      name: 'South Korea',
      lat: 35.9078,
      lng: 127.7669,
    },
    {
      name: 'Spain',
      lat: 40.4637,
      lng: -3.7492,
    },
    {
      name: 'Suriname',
      lat: 3.9193,
      lng: -56.0278,
    },
    {
      name: 'Sweden',
      lat: 60.1282,
      lng: 18.6435,
    },
    {
      name: 'Switzerland',
      lat: 46.8182,
      lng: 8.2275,
    },
    {
      name: 'Tajikistan',
      lat: 38.861,
      lng: 71.2761,
    },
    {
      name: 'Thailand',
      lat: 15.87,
      lng: 100.9925,
    },
    {
      name: 'Timor-Leste',
      lat: -8.8742,
      lng: 125.7275,
    },
    {
      name: 'Trinidad and Tobago',
      lat: 10.6918,
      lng: -61.2225,
    },
    {
      name: 'Tunisia',
      lat: 33.8869,
      lng: 9.5375,
    },
    {
      name: 'Turkey',
      lat: 38.9637,
      lng: 35.2433,
    },
    {
      name: 'Turks and Caicos Islands',
      lat: 21.694,
      lng: -71.7979,
      position: 'top',
    },
    {
      name: 'Uganda',
      lat: 1.3733,
      lng: 32.2903,
    },
    {
      name: 'UAE',
      lat: 23.4241,
      lng: 53.8478,
      description: 'Alpine Armoring International Partner',
      color: '#A020F0',
    },
    {
      name: 'United Kingdom',
      lat: 55.3781,
      lng: -3.436,
    },
    {
      name: 'Uzbekistan',
      lat: 41.3775,
      lng: 64.5853,
    },
    {
      name: 'Vietnam',
      lat: 14.0583,
      lng: 108.2772,
    },
    {
      name: 'Virginia',
      lat: 38.888691,
      lng: -77.417488,
      description: 'Alpine Armoring Headquarters',
      color: '#fff',
    },
    {
      name: 'Nevada',
      lat: 36.16909,
      lng: -115.140579,
      description: 'Alpine Armoring Regional Office',
      color: '#1AA3E8',
    },
    {
      name: 'California',
      lat: 32.715759,
      lng: -117.163818,
      description: 'Alpine Armoring Regional Office',
      color: '#1AA3E8',
    },
    {
      name: 'Texas',
      lat: 32.777981,
      lng: -96.796211,
      description: 'Alpine Armoring Regional Office',
      color: '#fff',
    },
    {
      name: 'Ontario',
      lat: 43.653225,
      lng: -79.383186,
      description: 'Alpine Armoring Regional Office',
      color: '#fff',
    },
    {
      name: 'South Africa',
      lat: -33.9823115016787,
      lng: 18.50769670326755,
    },
  ];

  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const width = Math.min(window.innerWidth, 800);
      const height = Math.min(window.innerHeight * 0.8, width);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!globeEl.current || !containerRef.current) return;

    globeEl.current.pointOfView({ altitude: 1.5 });

    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    // controls.enableZoom = false;

    const handleMouseEnter = () => {
      if (controls) controls.autoRotate = false;
    };

    const handleMouseLeave = () => {
      if (controls) controls.autoRotate = true;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).tagName === 'CANVAS') {
        e.stopPropagation();
      }
    };

    const container = containerRef.current;
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });

    const scene = globeEl.current.scene();
    if (scene) {
      const globeMesh = scene.children.find((obj: any) => obj.type === 'Mesh');
      if (globeMesh && globeMesh.material) {
        globeMesh.material.bumpScale = 50;
        globeMesh.material.shininess = 50;
      }
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="b-globe-container"
        style={{
          height: `${dimensions.height}px`,
        }}
      >
        <Globe
          ref={globeEl}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="rgba(0,0,0,0)"
          labelsData={locations}
          labelLat={(d: Location) => d.lat}
          labelLng={(d: Location) => d.lng}
          labelText={(d: Location) => d.name}
          labelAltitude={0}
          labelSize={0.8}
          labelDotRadius={0.5}
          labelLabel={(d: Location) => d.name}
          animateIn={false}
          labelDotOrientation={(d: Location) => d.position || 'right'}
          labelColor={(d: Location) => (d.color ? d.color : '#FFD700')}
          labelResolution={2}
        />
      </div>

      <Legend />
    </>
  );
};

export default GlobeComponent;
