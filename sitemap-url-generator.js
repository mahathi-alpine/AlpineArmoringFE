function generateVehicleUrls() {
  const makes = [
    'audi',
    'bentley',
    'bmw',
    // 'boxer',
    'bulldog',
    'cadillac',
    'chevrolet',
    'cuda',
    'cyclone',
    'ford',
    'genesis',
    'gmc',
    'honda',
    'hummer',
    'infiniti',
    'ineos',
    'lamborghini',
    'maybach',
    'international',
    'jeep',
    'land-rover',
    'lexus',
    'lincoln',
    'mastiff',
    'mercedes-benz',
    'nissan',
    'omicron',
    'pit-bull',
    'pointer',
    'range-rover',
    'rolls-royce',
    'tesla',
    'toyota',
    'typhoon',
  ];

  const vehicleTypes = {
    'armored-cash-in-transit-cit': ['international', 'ford', 'gmc'],
    'armored-law-enforcement': [
      'bulldog',
      'pointer',
      'ford',
      'typhoon',
      'pit-bull',
      'cuda',
      'cyclone',
      // 'boxer',
    ],
    'armored-pickup-trucks': [
      'chevrolet',
      'mastiff',
      'ford',
      'typhoon',
      'pit-bull',
      'toyota',
      'cyclone',
      'gmc',
      'tesla',
    ],
    'armored-sedans': [
      'lexus',
      'rolls-royce',
      'bentley',
      'genesis',
      'bmw',
      'audi',
      'toyota',
      'tesla',
      'mercedes-benz',
      'maybach',
    ],
    'armored-specialty-vehicles': ['mastiff', 'toyota', 'omicron'],
    'armored-suvs': [
      'jeep',
      'infiniti',
      'chevrolet',
      'lexus',
      'rolls-royce',
      'ford',
      'bentley',
      'genesis',
      'bmw',
      'hummer',
      'cadillac',
      'ineos',
      'audi',
      'toyota',
      'range-rover',
      'lincoln',
      'land-rover',
      'gmc',
      'tesla',
      'lamborghini',
      'mercedes-benz',
      'nissan',
      'maybach',
    ],
    'armored-vans-and-buses': ['pointer', 'toyota', 'honda', 'gmc'],
  };

  const urls = [];

  makes.forEach((make) => {
    urls.push({
      loc: `/vehicles-we-armor?make=${make}`,
      priority: '0.5',
      changefreq: 'monthly',
    });
  });

  Object.entries(vehicleTypes).forEach(([type, allowedMakes]) => {
    allowedMakes.forEach((make) => {
      urls.push({
        loc: `/vehicles-we-armor/type/${type}?make=${make}`,
        priority: '0.5',
        changefreq: 'monthly',
      });
    });
  });

  const spanishUrls = urls.map((url) => ({
    loc: url.loc
      .replace('/vehicles-we-armor', '/es/vehiculos-que-blindamos')
      .replace(
        '/type/armored-cash-in-transit-cit',
        '/tipo/transporte-blindado-valores-cit'
      )
      .replace(
        '/type/armored-law-enforcement',
        '/tipo/fuerzas-del-orden-blindadas'
      )
      .replace('/type/armored-pickup-trucks', '/tipo/camionetas-blindadas')
      .replace('/type/armored-sedans', '/tipo/sedanes-blindados')
      .replace(
        '/type/armored-specialty-vehicles',
        '/tipo/vehiculos-blindados-especiales'
      )
      .replace('/type/armored-suvs', '/tipo/suvs-blindados')
      .replace(
        '/type/armored-vans-and-buses',
        '/tipo/furgonetas-y-autobuses-blindados'
      ),
    priority: url.priority,
    changefreq: url.changefreq,
  }));

  return {
    en: urls,
    es: spanishUrls,
  };
}

module.exports = generateVehicleUrls;
