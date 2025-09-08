import { countryFlags } from './countryFlags';

export const getCountryName = (serverName: string): string => {
  return serverName.replace(/#\d+$/, '').trim();
};

export const getCountryFlag = (serverName: string): string => {
  const countryName = getCountryName(serverName);
  return countryFlags[countryName] || '🏳️';
};
