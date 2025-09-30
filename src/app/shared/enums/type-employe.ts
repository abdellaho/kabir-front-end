export enum TypeEmploye {
  ADMIN_A = 0,
  ADMIN_B = 1,
  ADMIN = 2,
  NORMAL = 3,
  SOFT= 4,
}

export const FilteredTypeEmploye = [
  { label: 'Admin', value: TypeEmploye.ADMIN },
  { label: 'Normal', value: TypeEmploye.NORMAL },
];