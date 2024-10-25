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

const GlobeComponent: React.FC<GlobeComponentProps> = ({ locations }) => {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    if (!globeEl.current || !containerRef.current) return;

    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    const handleMouseEnter = () => {
      if (controls) {
        controls.autoRotate = false;
      }
    };

    const handleMouseLeave = () => {
      if (controls) {
        controls.autoRotate = true;
      }
    };

    // Add event listeners to the container div
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);

    // Access the Three.js scene
    const scene = globeEl.current.scene();
    if (scene) {
      const globeMesh = scene.children.find((obj: any) => obj.type === 'Mesh');
      if (globeMesh && globeMesh.material) {
        globeMesh.material.bumpScale = 50;
        globeMesh.material.shininess = 50;
      }
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          'mouseenter',
          handleMouseEnter
        );
        containerRef.current.removeEventListener(
          'mouseleave',
          handleMouseLeave
        );
      }
    };
  }, []);

  const handleLabelClick = (label: Location) => {
    setSelectedLocation(label);

    if (globeEl.current) {
      globeEl.current.pointOfView(
        {
          lat: label.lat,
          lng: label.lng,
          altitude: 1.5,
        },
        1000
      );
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Globe
        ref={globeEl}
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
        onLabelClick={handleLabelClick}
        labelLabel={(d: Location) => d.name}
        animateIn={false}
        labelDotOrientation={(d: Location) =>
          (d.position || 'right') as 'top' | 'right' | 'bottom'
        }
        labelColor={(d: Location) => (d.color ? d.color : '#FFD700')}
        labelResolution={2}
      />
      {selectedLocation?.description && (
        <div className={`b-globe_popup`}>
          <h3>{selectedLocation.name}</h3>
          <p>{selectedLocation.description}</p>
          <button onClick={() => setSelectedLocation(null)}>X</button>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
