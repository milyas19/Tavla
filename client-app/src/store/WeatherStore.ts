import { atom } from 'recoil';

export const WeatherStore = atom({
    key: 'WeatherStoreKey',
    default: [] as any,
  });

  export const WeatherFirstElementOfDayStore= atom({
    key: 'WeatherFirstElementOfDayStoreKey',
    default: [] as any,
  });  
