export const rwandaDistricts = [
  // Kigali City
  { district: 'Gasabo', province: 'Kigali City' },
  { district: 'Kicukiro', province: 'Kigali City' },
  { district: 'Nyarugenge', province: 'Kigali City' },

  // Northern Province
  { district: 'Burera', province: 'Northern Province' },
  { district: 'Gakenke', province: 'Northern Province' },
  { district: 'Gicumbi', province: 'Northern Province' },
  { district: 'Musanze', province: 'Northern Province' },
  { district: 'Rulindo', province: 'Northern Province' },

  // Southern Province
  { district: 'Gisagara', province: 'Southern Province' },
  { district: 'Huye', province: 'Southern Province' },
  { district: 'Kamonyi', province: 'Southern Province' },
  { district: 'Muhanga', province: 'Southern Province' },
  { district: 'Nyamagabe', province: 'Southern Province' },
  { district: 'Nyanza', province: 'Southern Province' },
  { district: 'Nyaruguru', province: 'Southern Province' },
  { district: 'Ruhango', province: 'Southern Province' },

  // Eastern Province
  { district: 'Bugesera', province: 'Eastern Province' },
  { district: 'Gatsibo', province: 'Eastern Province' },
  { district: 'Kayonza', province: 'Eastern Province' },
  { district: 'Kirehe', province: 'Eastern Province' },
  { district: 'Ngoma', province: 'Eastern Province' },
  { district: 'Nyagatare', province: 'Eastern Province' },
  { district: 'Rwamagana', province: 'Eastern Province' },

  // Western Province
  { district: 'Karongi', province: 'Western Province' },
  { district: 'Ngororero', province: 'Western Province' },
  { district: 'Nyabihu', province: 'Western Province' },
  { district: 'Nyamasheke', province: 'Western Province' },
  { district: 'Rubavu', province: 'Western Province' },
  { district: 'Rutsiro', province: 'Western Province' },
  { district: 'Rusizi', province: 'Western Province' },
];

// Array of strings formatted as "District, Province"
export const districtOptions = rwandaDistricts.map(d => `${d.district}, ${d.province}`);
