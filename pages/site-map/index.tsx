import { getPageData } from 'lib/api';
import Link from 'next/link';

// Reusable function to group, sort, and render data
function renderGroupedData(data, sortFunction, renderItem) {
  // Group data by category
  // Assuming `data` is your original array of items
  const filteredData = data.filter(
    (item) =>
      !item.attributes.categories || item.attributes.categories.data.length > 0
  );

  const groupedByCategory = filteredData.reduce((acc, item) => {
    const category =
      item.attributes.categories && item.attributes.categories.data.length > 0
        ? item.attributes.categories.data[0].attributes.title
        : item.attributes.category.data
          ? item.attributes.category.data.attributes.title
          : item.attributes.category;

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Convert the groupedByCategory object into an array of objects
  const array = Object.entries(groupedByCategory).map(([title, items]) => ({
    title,
    items,
  }));

  // Sort the array based on the provided sortFunction
  array.sort(sortFunction);

  // Render the data
  return array.map((category) => (
    <div key={`${category.title}-group`}>
      <strong>{category.title}</strong>
      <ul>
        {(category.items as any[]).map((item, index) => (
          <li key={index}>{renderItem(item)}</li>
        ))}
      </ul>
    </div>
  ));
}

function Sitemap(props) {
  // const vehicles = props.vehicles.data;
  // const inventory = props.inventory.data;

  // console.log(inventory)
  // return null;

  // Sort function for vehicles
  const sortVehicles = (a, b) => {
    if (a.title === '[object Object]') return 1;
    if (b.title === '[object Object]') return -1;

    const indexA = props.filters.findIndex(
      (c) => c.attributes.title === a.title
    );
    const indexB = props.filters.findIndex(
      (c) => c.attributes.title === b.title
    );
    return indexA - indexB;
  };

  // Sort function for inventory
  const sortInventory = (a, b) => {
    if (a.title === '[object Object]') return 1;
    if (b.title === '[object Object]') return -1;

    const indexA = props.filters.findIndex(
      (c) => c.attributes.title === a.title
    );
    const indexB = props.filters.findIndex(
      (c) => c.attributes.title === b.title
    );
    return indexA - indexB;
  };

  const renderItem = (item) => (
    <Link href={item.attributes.slug}>{item.attributes.title}</Link>
  );

  return (
    <div className={`static container_small`}>
      <div>
        <h2>Vehicles we armor</h2>
        {renderGroupedData(props.vehicles.data, sortVehicles, renderItem)}
      </div>

      <div>
        <h2>Inventory</h2>
        {renderGroupedData(props.inventory.data, sortInventory, renderItem)}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const filters = await getPageData({
    route: 'categories',
    sort: 'order',
    populate: 'inventory_vehicles',
    fields: 'fields[0]=title&fields[1]=slug',
  }).then((response) => response.data);

  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    populate: 'category',
    sort: 'title',
  });

  const inventory = await getPageData({
    route: 'inventories',
    sort: 'title',
    populate: 'categories',
  });

  return {
    props: { filters, vehicles, inventory },
  };
}

export default Sitemap;
