import BusLiveLocation from '../src/modules/tracking/tracking.model.js';
import sequelize from '../src/config/db.js';

async function checkLocation() {
  try {
    const location = await BusLiveLocation.findOne({ 
      where: { busId: 'a3d459a9-bc52-49f6-a65b-679fda98104c' } 
    });
    if (location) {
      console.log('--- LIVE LOCATION FOUND ---');
      console.log(`Latitude: ${location.latitude}`);
      console.log(`Longitude: ${location.longitude}`);
      console.log(`Last Updated: ${location.timestamp}`);
    } else {
      console.log('No live location found for Bus ID: a3d459a9-bc52-49f6-a65b-679fda98104c');
    }
  } catch (error) {
    console.error('Error checking location:', error);
  } finally {
    await sequelize.close();
  }
}

checkLocation();
