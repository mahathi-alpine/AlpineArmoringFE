import styles from './VehicleDetailsList.module.scss';
import useLocale from 'hooks/useLocale';

function VehicleDetailsList({ vehicleDetails }) {
  const { lang } = useLocale();

  const vehicleDetailsMain = {
    [lang.level]: 'armor_level',
    [lang.VIN]: 'VIN',
    [lang.vehicleID]: 'vehicleID',
    [lang.enginePower]: 'engine',
    [lang.trans]: 'trans',
    [lang.year]: 'year',
    [lang.miles]: 'miles',
    [lang.drivetrain]: 'driveTrain',
    [lang.colorExt]: 'color_ext',
    [lang.colorInt]: 'color_int',
    [lang.trim]: 'trim',
    [lang.wheels]: 'wheels',
    [lang.height]: 'height',
    [lang.length]: 'length',
    [lang.width]: 'width',
    [lang.wheelbase]: 'wheelbase',
    [lang.weightArmored]: 'weight',
  };

  const formatDimensionValue = (key, value) => {
    if (key === lang.weightArmored) {
      // Apply thousands separator to the pounds value if it's in the thousands
      const poundsValue =
        parseInt(value) >= 1000
          ? parseInt(value).toLocaleString()
          : parseInt(value);
      // Convert pounds to kilograms and round to the nearest whole number
      const weightInKg = Math.round(value * 0.45359237);
      // Apply thousands separator to the kilograms value if it's in the thousands
      const kilogramsValue =
        weightInKg >= 1000 ? weightInKg.toLocaleString() : weightInKg;
      return `${poundsValue} lbs (${kilogramsValue} kg)`;
    } else if (
      [lang.height, lang.length, lang.width, lang.wheelbase].includes(key)
    ) {
      // Convert inches to centimeters
      return `${value} in. (${Math.round(value * 2.54)} cm)`;
    } else {
      return value;
    }
  };

  const isValidValue = (value) => {
    return value != null && value !== '' && value !== ' ';
  };

  return (
    <ul className={`${styles.inventory_details_list}`}>
      {Object.entries(vehicleDetailsMain).map(([key, value]) => {
        const fieldValue = vehicleDetails?.[value];

        if (!isValidValue(fieldValue)) {
          return null;
        }

        const dimensionValue = formatDimensionValue(key, fieldValue);

        return (
          <li key={key} className={`${styles.inventory_details_list_item}`}>
            {`${key}:`}
            <span>{dimensionValue}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default VehicleDetailsList;
