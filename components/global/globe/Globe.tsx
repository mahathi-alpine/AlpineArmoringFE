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

interface GlobeComponentProps {
  locations: Location[];
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

const GlobeComponent: React.FC<GlobeComponentProps> = ({ locations }) => {
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
