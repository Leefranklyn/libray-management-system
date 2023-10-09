import { updateStatusToDue, fineCalculator } from './updateStatusToDue.js';

const arg = process.argv[2];

if (arg === 'updateStatusToDue') {
  updateStatusToDue();
} else if (arg === 'fineCalculator') {
  fineCalculator();
} else {
  console.log('Invalid argument. Use "updateStatusToDue" or "fineCalculator".');
}
