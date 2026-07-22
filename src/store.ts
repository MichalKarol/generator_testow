import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export type Answer = {
  answer: string;
  correct: boolean;
};
export type SimpleQuestion = {
  question: string;
  answers: Answer[];
};
export type PrescriptionQuestion = {
  question: string;
};

export type Group = {
  simpleQuestions: SimpleQuestion[];
  prescriptionQuestions: PrescriptionQuestion[];
};

export type Test = {
  title: string;
  subtitle: string;
  createdAt: string;
  seed: number;
  groups: Group[];
};

export type Database = {
  name: string;

  simpleQuestions: SimpleQuestion[];
  prescriptionQuestions: PrescriptionQuestion[];
  tests: Test[];
};

type State = {
  databases: Database[];
};
type Actions = {
  createDatabase: (name: string) => void;
  updateDatabase: (databaseId: number, name: string) => void;
  removeDatabase: (databaseId: number) => void;
  addSimpleQuestion: (databaseId: number, question: SimpleQuestion) => void;
  updateSimpleQuestion: (
    databaseId: number,
    questionId: number,
    question: string,
  ) => void;
  removeSimpleQuestion: (databaseId: number, questionId: number) => void;
  addSimpleQuestionAnswer: (
    databaseId: number,
    questionId: number,
    answer: Answer,
  ) => void;
  updateSimpleQuestionAnswer: (
    databaseId: number,
    questionId: number,
    answerId: number,
    answer: string,
    correct: boolean,
  ) => void;
  removeSimpleQuestionAnswer: (
    databaseId: number,
    questionId: number,
    answerId: number,
  ) => void;
  addPrescriptionQuestion: (
    databaseId: number,
    question: PrescriptionQuestion,
  ) => void;
  updatePrescriptionQuestion: (
    databaseId: number,
    questionId: number,
    question: string,
  ) => void;
  removePrescriptionQuestion: (databaseId: number, questionId: number) => void;
  createTest: (databaseId: number, test: Test) => void;
  removeTest: (databaseId: number, testId: number) => void;
  loadData: (state: State) => void;
};

export const useStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      databases: [],
      createDatabase: (name: string) =>
        set((state) => {
          state.databases.push({
            name,
            simpleQuestions: [],
            prescriptionQuestions: [],
            tests: [],
          });
        }),
      updateDatabase: (databaseId: number, name: string) =>
        set((state) => {
          state.databases[databaseId].name = name;
        }),
      removeDatabase: (databaseId: number) =>
        set((state) => {
          state.databases.splice(databaseId, 1);
        }),
      addSimpleQuestion: (databaseId: number, question: SimpleQuestion) =>
        set((state) => {
          state.databases[databaseId].simpleQuestions.push(question);
        }),
      updateSimpleQuestion: (
        databaseId: number,
        questionId: number,
        question: string,
      ) =>
        set((state) => {
          state.databases[databaseId].simpleQuestions[questionId].question =
            question;
        }),
      removeSimpleQuestion: (databaseId: number, questionId: number) =>
        set((state) => {
          state.databases[databaseId].simpleQuestions.splice(questionId, 1);
        }),

      addSimpleQuestionAnswer: (
        databaseId: number,
        questionId: number,
        answer: Answer,
      ) =>
        set((state) => {
          state.databases[databaseId].simpleQuestions[questionId].answers.push(
            answer,
          );
        }),
      updateSimpleQuestionAnswer: (
        databaseId: number,
        questionId: number,
        answerId: number,
        answer: string,
        correct: boolean,
      ) =>
        set((state) => {
          state.databases[databaseId].simpleQuestions[questionId].answers[
            answerId
          ].answer = answer;
          state.databases[databaseId].simpleQuestions[questionId].answers[
            answerId
          ].correct = correct;
        }),
      removeSimpleQuestionAnswer: (
        databaseId: number,
        questionId: number,
        answerId: number,
      ) =>
        set((state) => {
          state.databases[databaseId].simpleQuestions[
            questionId
          ].answers.splice(answerId, 1);
        }),
      addPrescriptionQuestion: (
        databaseId: number,
        question: PrescriptionQuestion,
      ) =>
        set((state) => {
          state.databases[databaseId].prescriptionQuestions.push(question);
        }),
      updatePrescriptionQuestion: (
        databaseId: number,
        questionId: number,
        question: string,
      ) =>
        set((state) => {
          state.databases[databaseId].prescriptionQuestions[
            questionId
          ].question = question;
        }),
      removePrescriptionQuestion: (databaseId: number, questionId: number) =>
        set((state) => {
          state.databases[databaseId].prescriptionQuestions.splice(
            questionId,
            1,
          );
        }),
      createTest: (databaseId: number, test: Test) =>
        set((state) => {
          state.databases[databaseId].tests.push(test);
        }),
      removeTest: (databaseId: number, testId: number) =>
        set((state) => {
          state.databases[databaseId].tests.splice(testId, 1);
        }),
      loadData: (loadedState) =>
        set((state) => {
          state.databases = loadedState.databases;
        }),
    })),
    { name: "test-databases" },
  ),
);
