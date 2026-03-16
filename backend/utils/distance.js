/**
 * Calculates the great-circle distance between two points 
 * using the Haversine formula.
 * @param {number} lat1 - Latitude of user
 * @param {number} lon1 - Longitude of user
 * @param {number} lat2 - Latitude of stall
 * @param {number} lon2 - Longitude of stall
 * @returns {number} - Distance in Kilometers
 * @throws {Error} - If coordinates are invalid
 */
const getDistance = (lat1, lon1, lat2, lon2) => {
  // Validate input
  const validateCoord = (coord, name) => {
    const num = Number(coord);
    if (isNaN(num)) {
      throw new Error(`Invalid ${name}: must be a number`);
    }
    return num;
  };

  try {
    const [lt1, ln1, lt2, ln2] = [lat1, lon1, lat2, lon2].map((val, idx) => 
      validateCoord(val, ['lat1', 'lon1', 'lat2', 'lon2'][idx])
    );

    // Validate ranges
    if (Math.abs(lt1) > 90 || Math.abs(lt2) > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
    if (Math.abs(ln1) > 180 || Math.abs(ln2) > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }

    // Haversine Formula
    const R = 6371; // Earth's radius in km
    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(lt2 - lt1);
    const dLon = toRad(ln2 - ln1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lt1)) *
        Math.cos(toRad(lt2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Return rounded distance
    return parseFloat(distance.toFixed(2));
    
  } catch (error) {
    console.error("Distance Calculation Error:", error.message);
    throw error; // Re-throw for the caller to handle
  }
};

module.exports = { getDistance };