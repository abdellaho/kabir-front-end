export interface PlanComptable {
  id: bigint;
  code: number;
  designation: string;
  nature: string;
  formule: string;
  codeString: string;
}

export function initObjectPlanComptable(): PlanComptable {
  return {
    id: BigInt(0),
    code: 0,
    designation: "",
    nature: "",
    formule: "",
    codeString: "",
  };
}