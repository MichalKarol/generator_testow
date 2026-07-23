import { useStore, type SimpleQuestion } from "@/store";
import { createFileRoute } from "@tanstack/react-router";
import pdfStyles from "./pdfStyles.css?inline";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/_raw/database/$id/tests/$testId/groups/$groupId/key",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const store = useStore();
  const { id, testId, groupId } = Route.useParams();
  const databaseId = Number.parseInt(id);
  const testid = Number.parseInt(testId);
  const groupid = Number.parseInt(groupId);
  const test = store.databases[databaseId].tests[testid];
  const group = store.databases[databaseId].tests[testid].groups[groupid];
  const date = new Date(test.createdAt);

  useEffect(() => {
    window.setTimeout(() => {
      window.print();
      window.onfocus = function () {
        window.close();
      };
    }, 100);
  });

  const getCorrectAnswer = (question: SimpleQuestion): string => {
    const idx = question.answers.findIndex((answer) => answer.correct);
    if (idx === -1) return "Brak odpowiedzi";
    return String.fromCodePoint(97 + idx);
  };

  return (
    <>
      <style type="text/css">{pdfStyles}</style>
      <title>{test.title}</title>
      <div className="header-container">
        <div className="header-row">
          <div className="right-side">
            Wrocław, {date.toLocaleDateString("pl")}
          </div>
        </div>

        <div className="center-block">
          <div className="exam-title">{test.title}</div>
          <div className="exam-subtitle">{test.subtitle}</div>
        </div>

        <div className="header-row">
          <div className="left-side">Grupa: {groupid + 1}</div>
        </div>
      </div>

      <div className="questions-container">
        {group.simpleQuestions.map((question, idx) => (
          <div className="question-block" key={`${question.question}-${idx}`}>
            <div className="question-text">
              {idx + 1}. {getCorrectAnswer(question)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
