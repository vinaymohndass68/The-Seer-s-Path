
import { CHALDEAN_CHART, WEEKDAYS } from '../constants';
import { NumerologyResult, PersonData, UserInput, CompanyData } from '../types';

/**
 * Reduces a number to a single digit by summing its digits recursively.
 */
const reduceToSingleDigit = (num: number): number => {
  if (num <= 9) return num;
  const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduceToSingleDigit(sum);
};

/**
 * Calculates the name number based on Chaldean values.
 */
const calculateNameNumber = (fullName: string): { compound: number, single: number } => {
  const sanitized = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (const char of sanitized) {
    sum += CHALDEAN_CHART[char] || 0;
  }
  return {
    compound: sum,
    single: reduceToSingleDigit(sum)
  };
};

/**
 * Calculates the birth number based on the Day of the month.
 * Cheiro emphasizes the Day number as the Birth Number.
 */
const calculateBirthNumber = (birthDate: string): { compound: number, single: number } => {
  const day = parseInt(birthDate.split('-')[2], 10);
  return {
    compound: day,
    single: reduceToSingleDigit(day)
  };
};

/**
 * Calculates the Destiny Number based on the full birth date (Day + Month + Year).
 */
const calculateDestinyNumber = (birthDate: string): { compound: number, single: number } => {
  // birthDate format is YYYY-MM-DD
  const parts = birthDate.split('-');
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  const allDigits = (year + month + day).split('').map(digit => parseInt(digit, 10));
  const sum = allDigits.reduce((acc, curr) => acc + curr, 0);
  
  return {
    compound: sum,
    single: reduceToSingleDigit(sum)
  };
};

/**
 * Calculates the Personal Year Number:
 * Sum of (Day of Birth) + (Month of Birth) + (Target Year)
 */
const calculatePersonalYear = (dayOfBirth: number, monthOfBirth: number, targetYear: number): number => {
  const componentString = `${dayOfBirth}${monthOfBirth}${targetYear}`;
  const sum = componentString.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduceToSingleDigit(sum);
};

/**
 * Calculates the Personal Month Number:
 * Sum of (Personal Year) + (Target Month)
 */
const calculatePersonalMonth = (personalYear: number, targetMonth: number): number => {
    const sum = personalYear + targetMonth;
    return reduceToSingleDigit(sum);
};

/**
 * Calculates the Personal Day Number:
 * Sum of (Personal Month) + (Target Day of Month)
 */
const calculatePersonalDay = (personalMonth: number, targetDayOfMonth: number): number => {
    const sum = personalMonth + targetDayOfMonth;
    return reduceToSingleDigit(sum);
};


/**
 * Determine lucky days based on the single birth number (Planetary ruler).
 */
const getLuckyDays = (birthNumber: number): string[] => {
  switch (birthNumber) {
    case 1: return ["Sunday", "Monday"]; // Sun
    case 2: return ["Sunday", "Monday", "Friday"]; // Moon
    case 3: return ["Thursday", "Friday", "Tuesday"]; // Jupiter
    case 4: return ["Sunday", "Monday", "Saturday"]; // Uranus (Sun/Saturn link)
    case 5: return ["Wednesday", "Friday"]; // Mercury
    case 6: return ["Tuesday", "Friday", "Thursday"]; // Venus
    case 7: return ["Sunday", "Monday"]; // Neptune (Moon link)
    case 8: return ["Saturday", "Sunday", "Monday"]; // Saturn
    case 9: return ["Tuesday", "Thursday", "Friday"]; // Mars
    default: return [];
  }
};

const getLuckyColors = (birthNumber: number): string[] => {
   switch (birthNumber) {
    case 1: return ["Gold", "Yellow", "Orange"];
    case 2: return ["Green", "Cream", "White"];
    case 3: return ["Mauve", "Violet", "Purple"];
    case 4: return ["Electric Blue", "Grey"];
    case 5: return ["Light Grey", "White", "Silver"];
    case 6: return ["Blue", "Rose", "Pink"];
    case 7: return ["Green", "Pale Shades"];
    case 8: return ["Black", "Dark Blue", "Purple"];
    case 9: return ["Crimson", "Red", "Rose"];
    default: return [];
  }
}

const getLuckyStone = (birthNumber: number): string => {
   switch (birthNumber) {
    case 1: return "Ruby, Topaz";
    case 2: return "Pearl, Moonstone";
    case 3: return "Amethyst";
    case 4: return "Sapphire";
    case 5: return "Diamond, Platinum";
    case 6: return "Turquoise, Emerald";
    case 7: return "Moonstone, Cat's Eye";
    case 8: return "Amethyst, Dark Sapphire";
    case 9: return "Ruby, Garnet, Bloodstone";
    default: return "";
  }
}

const calculatePersonData = (fullName: string, birthDate: string): PersonData => {
  const nameCalc = calculateNameNumber(fullName);
  const birthCalc = calculateBirthNumber(birthDate);
  const destinyCalc = calculateDestinyNumber(birthDate);
  
  return {
    fullName,
    birthDate,
    birthNumber: birthCalc.single,
    birthCompound: birthCalc.compound,
    nameNumber: nameCalc.single,
    nameCompound: nameCalc.compound,
    destinyNumber: destinyCalc.single,
    destinyCompound: destinyCalc.compound,
    luckyDays: getLuckyDays(birthCalc.single),
    luckyColors: getLuckyColors(birthCalc.single),
    luckyStone: getLuckyStone(birthCalc.single),
  };
};

export const calculateNumerology = (input: UserInput): NumerologyResult => {
  const { fullName, birthDate, targetDate, mode, partnerName, partnerBirthDate, companyName, natureOfWork } = input;
  
  const personData = calculatePersonData(fullName, birthDate);

  const birthParts = birthDate.split('-');
  const birthDay = parseInt(birthParts[2], 10);
  const birthMonth = parseInt(birthParts[1], 10);

  const targetParts = targetDate.split('-');
  const targetYear = parseInt(targetParts[0], 10);
  const targetMonth = parseInt(targetParts[1], 10);
  const targetDayOfMonth = parseInt(targetParts[2], 10);

  const personalYear = calculatePersonalYear(birthDay, birthMonth, targetYear);
  const personalMonth = calculatePersonalMonth(personalYear, targetMonth);
  const personalDay = calculatePersonalDay(personalMonth, targetDayOfMonth);

  let partnerData;
  if (mode === 'COMPATIBILITY' && partnerName && partnerBirthDate) {
    const pData = calculatePersonData(partnerName, partnerBirthDate);
    const pBirthParts = partnerBirthDate.split('-');
    const pBirthDay = parseInt(pBirthParts[2], 10);
    const pBirthMonth = parseInt(pBirthParts[1], 10);
    const pPersonalYear = calculatePersonalYear(pBirthDay, pBirthMonth, targetYear);
    
    partnerData = {
      ...pData,
      personalYear: pPersonalYear
    };
  }

  let companyData: CompanyData | undefined;
  if (mode === 'COMPANY' && companyName && natureOfWork) {
      const nameCalc = calculateNameNumber(companyName);
      companyData = {
          name: companyName,
          nameNumber: nameCalc.single,
          nameCompound: nameCalc.compound,
          natureOfWork: natureOfWork
      };
  }

  return {
    ...personData,
    personalYear,
    personalMonth,
    personalDay,
    targetDate,
    mode,
    partner: partnerData,
    company: companyData
  };
};
