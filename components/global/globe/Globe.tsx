import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}
interface GlobeComponentProps {
  locations: Location[];
}

const GlobeComponent: React.FC<GlobeComponentProps> = ({ locations }) => {
  const globeEl = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    if (!globeEl.current) return;

    // Auto-rotate
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Access the Three.js scene
    const scene = globeEl.current.scene();
    if (scene) {
      const globeMesh = scene.children.find((obj: any) => obj.type === 'Mesh');
      if (globeMesh && globeMesh.material) {
        globeMesh.material.bumpScale = 10;
        globeMesh.material.shininess = 10;
      }
    }
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
      ); // 1000ms animation duration
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        // globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        // bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        labelsData={locations}
        labelLat={(d: Location) => d.lat}
        labelLng={(d: Location) => d.lng}
        labelText={(d: Location) => d.name}
        labelAltitude={0.01}
        labelSize={1.5}
        labelDotRadius={0.8}
        labelColor={() => 'rgba(255, 165, 0, 0.75)'}
        labelResolution={2}
        onLabelClick={handleLabelClick}
      />
      {selectedLocation && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <h3>{selectedLocation.name}</h3>
          <p>{selectedLocation.description || 'No description available.'}</p>
          <button onClick={() => setSelectedLocation(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
