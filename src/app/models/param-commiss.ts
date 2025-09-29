export interface ParamCommiss {
  id: bigint;
  mntDepart: number;
  mntFin: number;
  pourc: number;
}

export function initObjectParamCommiss(): ParamCommiss {
  return {
    id: BigInt(0),
    mntDepart: 0,
    mntFin: 0,
    pourc: 0,
  };
}