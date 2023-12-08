import fs from 'fs';
import path from 'path';

export function readInput(fileName: string, splitBy = '\n'): string[] {
  return fs.readFileSync(path.join(fileName)).toString('utf-8').split(splitBy);
}

export function readNumberInput(fileName: string) {
  return readInput(fileName).map(Number);
}

export function findLCMBruteForced(numbers: number[]): number {
  const multiples = numbers.map(() => ({}) as { [key: number]: boolean });
  let multiplier = 1;

  while (true) {
    if (multiplier % 1_000_000 === 0) console.log(multiplier);

    for (const [index, number] of numbers.entries()) {
      const numberMultiple = number * multiplier;
      multiples[index][numberMultiple] = true;

      if (multiples.every((multiplesSet) => !!multiplesSet[numberMultiple])) return numberMultiple;
    }

    multiplier++;
  }
}

export function findLCM(numbers: number[]): number {
  const numbersPrimeFactors = numbers.map((number) => findPrimeFactorsInExponentialForm(number));

  const primes: { [key: number]: [number, number] } = {};

  for (const numberPrimeFactor of numbersPrimeFactors) {
    for (const [prime, exponential] of numberPrimeFactor) {
      if (!primes[prime] || exponential > primes[prime][1]) {
        primes[prime] = [prime, exponential];
      }
    }
  }

  return Object.values(primes).reduce((total, [prime, exponential]) => {
    return total * prime ** exponential;
  }, 1);
}

export function findPrimeFactors(number: number): number[] {
  const primeFactors: number[] = [];
  const primeFinder = primeGenerator();
  let rest = number;
  let currentPrime = primeFinder.next().value;

  while (rest !== 1) {
    if (rest % currentPrime === 0) {
      primeFactors.push(currentPrime);
      rest = rest / currentPrime;
    } else {
      currentPrime = primeFinder.next().value;
    }
  }

  return primeFactors;
}

export function findPrimeFactorsInExponentialForm(number: number): Array<[number, number]> {
  const primeFactors = findPrimeFactors(number);
  const primeQuantity: { [index: number]: number } = primeFactors.reduce(
    (total: { [index: number]: number }, prime: number): { [index: number]: number } => {
      if (total[prime] === undefined) total[prime] = 1;
      else total[prime]++;

      return total;
    },
    {},
  );

  return Object.keys(primeQuantity).map((prime) => [Number(prime), primeQuantity[Number(prime)]]);
}

export function* primeGenerator(): Generator<number> {
  const primeNumbers: number[] = [];
  let currentNumber = 2;

  function isPrime(number: number): boolean {
    // Numbers ending with 0, 2, 4, 6 and 8 are never prime numbers
    if (number > 9 && String(number).match(/[024568]$/)) return false;

    // Numbers whose sum of digits are divisible by 3 are never prime numbers
    const digitsSum = String(number)
      .split('')
      .reduce((total, num) => Number(num) + total, 0);
    if (number !== 3 && digitsSum % 3 === 0) {
      return false;
    }

    // If the number is divisible by any of the prime numbers less than its square root, it is not a prime number
    if (primeNumbers.some((primeNumber) => number % primeNumber === 0)) return false;

    return true;
  }

  while (true) {
    while (!isPrime(currentNumber)) {
      currentNumber++;
    }

    primeNumbers.push(currentNumber);
    yield currentNumber;

    currentNumber++;
  }
}
