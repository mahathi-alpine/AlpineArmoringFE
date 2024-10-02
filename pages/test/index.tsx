import dynamic from 'next/dynamic';
import ClientOnly from 'components/ClientOnly';

const GlobeComponent = dynamic(() => import('components/global/globe/Globe'), {
  ssr: false,
});

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

export default function Test() {
  const companyLocations: Location[] = [
    {
      name: 'New York',
      lat: 40.7128,
      lng: -74.006,
      description: 'Our headquarters in the heart of Manhattan.',
    },
    {
      name: 'London',
      lat: 51.5074,
      lng: -0.1278,
      description: 'Our European office in central London.',
    },
    {
      name: 'Tokyo',
      lat: 35.6762,
      lng: 139.6503,
      description: 'Our Asia-Pacific hub in bustling Tokyo.',
    },
  ];

  return (
    <div>
      <main>
        <div style={{ width: '100%', height: '800px' }}>
          <ClientOnly className={`b-globe`}>
            <GlobeComponent locations={companyLocations} />
          </ClientOnly>
        </div>
      </main>
    </div>
  );
}
