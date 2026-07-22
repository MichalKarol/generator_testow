import {
  type SimpleQuestion,
  type PrescriptionQuestion,
  type Group,
} from "./store";

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shuffleFisherYates = <T>(arr: T[], generator: () => number): T[] => {
  const newArr = structuredClone(arr);

  for (let i = 1; i < arr.length; i++) {
    const j = Math.floor(generator() * i);
    const tmp = newArr[j];
    newArr[j] = newArr[i];
    newArr[i] = tmp;
  }
  return newArr;
};

export const generateTestGroups = (
  groups: number,
  seed: number,
  simpleQuestionsSample: number,
  simpleQuestions: SimpleQuestion[],
  prescriptionQuestionsSample: number,
  prescriptionQuestions: PrescriptionQuestion[],
): Group[] => {
  const generator = mulberry32(seed);

  return new Array(groups).fill(null).map(() => ({
    simpleQuestions: shuffleFisherYates(simpleQuestions, generator)
      .slice(0, simpleQuestionsSample)
      .map((question) => ({
        question: question.question,
        answers: shuffleFisherYates(question.answers, generator),
      })),
    prescriptionQuestions: shuffleFisherYates(
      prescriptionQuestions,
      generator,
    ).slice(0, prescriptionQuestionsSample),
  }));
};

export const openUrl = (url: string, filename: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener noreferer";
  a.target = "_blank";
  a.download = filename;
  a.click();
};
