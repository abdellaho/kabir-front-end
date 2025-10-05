import { TypeEmploye } from "../enums/type-employe";

// Define Message interface locally if not exported by primeng/api
export interface Message {
  severity?: string;
  summary?: string;
  detail?: string;
}

export function arrayToMap<T>(array: T[], keyAttr: keyof T, valueAttrs: (keyof T)[], separators: string[]): Map<number, string> {
    const result = new Map<number, string>();

    if(array && array.length > 0) {
      array.forEach(item => {
        try {
          const key = Number(item[keyAttr]);
      
          // Concatenate values from the specified attributes with corresponding separators
          const value = valueAttrs
            .map((attr, index) => {
              const attrValue = item[attr];
              return attrValue !== undefined && attrValue !== null ? String(attrValue) : '';
            })
            .reduce((acc, curr, index) => {
              const separator = separators[index] || ''; // Use the separator if provided, or empty string
              const returnedValue : string = index === 0 ? (curr + separator) : (acc + (acc && curr ? separator : '') + curr);
              return returnedValue;
            }, '');
      
          result.set(key, value);
        } catch (error) {
          throw new Error('Failed to convert key attribute to BigInt: ' + error);
        }
      });
    }
  
    return result;
}

export function getElementFromMap(map: Map<number, string>, key: number): string {
  const keyNumber = typeof key === 'string' ? Number(key) : key;
  const value = map.get(keyNumber);
  return value !== undefined ? value : '';
}

export function getElementFromMap1(map: Map<number, string>, id: number){
    const value = map.get(id) || '';
    return value;
}

export function mapToDateBackEnd(dateToMap: Date): Date {
  const formattedDate = dateToMap.toLocaleDateString().split('/');
  return new Date(formattedDate[2] + '-' + formattedDate[1] + '-' + formattedDate[0]);
}

export function mapToDateTimeBackEnd(dateToMap: Date): Date {
  // Extract individual components of the Date object
  const year = dateToMap.getFullYear();
  const month = String(dateToMap.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(dateToMap.getDate()).padStart(2, '0');
  const hours = String(dateToMap.getHours()).padStart(2, '0');
  const minutes = String(dateToMap.getMinutes()).padStart(2, '0');
  const seconds = String(dateToMap.getSeconds()).padStart(2, '0');

  // Construct the LocalDateTime string in the format: 'YYYY-MM-DDTHH:mm:ss'
  let date: Date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);

  const timezoneOffset = -dateToMap.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() + (timezoneOffset * 60 * 1000));

  return adjustedDate;
}

export function getDRPP(id: number, mapOfDRPPOfEmployees: Map<number, string>): string {
  return getElementFromMap(mapOfDRPPOfEmployees, id);
}

export function getAttribut(id: number, map: Map<number, string>): string {
  return getElementFromMap(map, id);
}

export function messageSucces(): Message {
  return { severity: 'success', summary: 'Succès', detail: 'Opération effectuée avec succès.' };
}

export function messageErreur(): Message {
  return { severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de l\'opération. Veuillez réessayer l\'opération' };
}

export function messageModification(): Message {
  return { severity: 'info', summary: 'Modification', detail: 'Modification effectuée avec succès.' };
}

export function messageSuppression(): Message {
  return { severity: 'warn', summary: 'Suppression', detail: 'Suppression effectuée avec succès.' };
}

export function convertTypeEmploye(typeEmploye: TypeEmploye): TypeEmploye {
  let typeEmployeReturn: TypeEmploye = TypeEmploye.ADMIN;
  if(typeEmploye.toLocaleString() === 'ADMIN') {
    typeEmployeReturn = TypeEmploye.ADMIN;
  } else if (typeEmploye.toLocaleString() === 'NORMAL') {
    typeEmployeReturn = TypeEmploye.NORMAL;
  } else if (typeEmploye.toLocaleString() === 'ADMIN_A') {
    typeEmployeReturn = TypeEmploye.ADMIN_A;
  } else if (typeEmploye.toLocaleString() === 'ADMIN_B') {
    typeEmployeReturn = TypeEmploye.ADMIN_B;
  }else if (typeEmploye.toLocaleString() === 'SOFT') {
    typeEmployeReturn = TypeEmploye.SOFT;
  }

  return typeEmployeReturn;
}