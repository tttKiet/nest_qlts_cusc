enum Carrier {
  Viettel = 'viettel',
  VinaPhone = 'vinaphone',
  MobiFone = 'mobifone',
}

export const carrierPrefixes: { [key in Carrier]: string[] } = {
  [Carrier.Viettel]: [
    '096',
    '097',
    '098',
    '086',
    '032',
    '033',
    '034',
    '035',
    '036',
    '037',
    '038',
    '039',
  ],
  [Carrier.VinaPhone]: ['091', '094', '083', '084', '085', '081', '082'],
  [Carrier.MobiFone]: ['090', '093', '070', '079', '077', '076', '078'],
};
