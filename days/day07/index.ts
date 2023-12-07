// https://adventofcode.com/2023/day/7
// Day 7: Camel Cards

import { readInput } from '../../common/index';

type Hands =
  | 'Five of a kind'
  | 'Four of a kind'
  | 'Full house'
  | 'Three of a kind'
  | 'Two pair'
  | 'One pair'
  | 'High card';

const HAND_STRENGTH = Object.freeze({
  'Five of a kind': 6,
  'Four of a kind': 5,
  'Full house': 4,
  'Three of a kind': 3,
  'Two pair': 2,
  'One pair': 1,
  'High card': 0,
});
const CARD_STRENGTH = Object.freeze({
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  '9': 8,
  '8': 7,
  '7': 6,
  '6': 5,
  '5': 4,
  '4': 3,
  '3': 2,
  '2': 1,
});
const CARD_STRENGTH_WITH_JOKER = Object.freeze({
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
  J: 1,
});

const game = readInput('days/day07/input01', '\n')
  .map((hand) => hand.split(' '))
  .map(
    ([cards, bet]): Hand => ({
      cards: cards.split('') as [Card, Card, Card, Card, Card],
      bet: Number(bet),
    }),
  );

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
type Hand = {
  cards: [Card, Card, Card, Card, Card];
  bet: number;
};

function scoreHand(withJoker: boolean, { cards }: Hand): Hands {
  const cardQuantity: { [index: string]: number } = {};

  for (const card of cards) {
    cardQuantity[card] = cardQuantity[card] ? cardQuantity[card] + 1 : 1;
  }

  let jokers = 0;
  if (cardQuantity.J && withJoker) {
    jokers = cardQuantity.J;
    cardQuantity.J = 0;
  }

  const score = Object.values(cardQuantity).sort((a, b) => b - a);

  score[0] += jokers;

  if (score[0] === 5) return 'Five of a kind';
  if (score[0] === 4) return 'Four of a kind';
  if (score[0] === 3 && score[1] === 2) return 'Full house';
  if (score[0] === 3) return 'Three of a kind';
  if (score[0] === 2 && score[1] === 2) return 'Two pair';
  if (score[0] === 2) return 'One pair';

  return 'High card';
}
function findWinner(withJoker: boolean, handA: Hand, handB: Hand): number {
  const scoreA = scoreHand(withJoker, handA);
  const scoreB = scoreHand(withJoker, handB);
  const STRENGHT = withJoker ? CARD_STRENGTH_WITH_JOKER : CARD_STRENGTH;

  if (HAND_STRENGTH[scoreA] > HAND_STRENGTH[scoreB]) return 1;
  if (HAND_STRENGTH[scoreA] < HAND_STRENGTH[scoreB]) return -1;

  for (let i = 0; i < handA.cards.length; i++) {
    const cardA = handA.cards[i];
    const cardB = handB.cards[i];

    if (STRENGHT[cardA] > STRENGHT[cardB]) return 1;
    if (STRENGHT[cardA] < STRENGHT[cardB]) return -1;
  }

  return 0;
}

const part01 = game.toSorted(findWinner.bind(null, false)).reduce((total, hand, position) => {
  return total + hand.bet * (position + 1);
}, 0);

const part02 = game.toSorted(findWinner.bind(null, true)).reduce((total, hand, position) => {
  return total + hand.bet * (position + 1);
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);
