module.exports = function generateQuestion(level) {
  const levels = {
    1: { count: 2, digits: 1 },
    2: { count: 3, digits: 2 },
    3: { count: 4, digits: 3 },
    4: { count: 5, digits: 4 },
  };

  const { count, digits } = levels[level];
  const operations = ["+", "-", "*", "/"];
  const numbers = [];

  for (let i = 0; i < count; i++) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  let question = `${numbers[0]}`;
  for (let i = 1; i < count; i++) {
    const op = operations[Math.floor(Math.random() * operations.length)];
    question += ` ${op} ${numbers[i]}`;
  }

  let answer;
  try {
    answer = eval(question);
  } catch {
    answer = 0;
  }

  return {
    q: question,
    correct: parseFloat(answer.toFixed(2)),
  };
};
