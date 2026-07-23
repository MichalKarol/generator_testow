import { createFileRoute } from "@tanstack/react-router";
import pdfStyles from "./pdfStyles.css?inline";
import { useStore } from "@/store";
import { useEffect } from "react";
import Prescription from "@/assets/prescription.jpg";

export const Route = createFileRoute(
  "/_raw/database/$id/tests/$testId/groups/$groupId/test",
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
  const maxPoints =
    group.simpleQuestions.length + group.prescriptionQuestions.length * 10;
  const grades = [
    Math.floor(0.7 * maxPoints),
    Math.floor(0.75 * maxPoints),
    Math.floor(0.8 * maxPoints),
    Math.floor(0.9 * maxPoints),
    Math.floor(0.95 * maxPoints),
    maxPoints,
  ];

  useEffect(() => {
    window.setTimeout(() => {
      window.print();
      window.onfocus = function () {
        window.close();
      };
    }, 100);
  });

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
          <div className="left-side">
            Imię i nazwisko:
            ....................................................
          </div>
        </div>

        <div className="header-row">
          <div className="left-side">
            Numer albumu: ....................................................
          </div>
        </div>

        <div className="header-row">
          <div className="left-side">Grupa: {groupid + 1}</div>
        </div>
      </div>
      <div className="questions-container">
        {group.simpleQuestions.map((question, idx) => (
          <div className="question-block" key={`${question.question}-${idx}`}>
            <div className="question-text">
              {idx + 1}. {question.question}
            </div>
            <ul className="answers-list">
              {question.answers.map((answer, answerIdx) => (
                <li
                  className="answer-item"
                  key={`${answer.answer}-${answerIdx}`}
                >
                  <span className="answer-letter">
                    {String.fromCodePoint(97 + answerIdx)})
                  </span>{" "}
                  {answer.answer}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {group.prescriptionQuestions.map((question, idx) => (
          <div className="question-block" key={`${question.question}-${idx}`}>
            <div className="question-text">
              {group.simpleQuestions.length + idx + 1}. {question.question}
            </div>
            <img
              className="recipe-image"
              src={Prescription}
              alt="Schemat recepty"
            />
          </div>
        ))}
      </div>

      <div className="footer">
        <div className="footer-title">
          Próg zaliczenia: 70% tj. {grades[0]} punktów
        </div>

        <table
          className="footer-table"
          style={{
            borderCollapse: "collapse",
            border: "none",
            marginTop: "5px",
            marginBottom: "10px",
          }}
        >
          <tr>
            <td style={{ padding: "2px 0" }}>
              {grades[0]} - {grades[1] - 1} pkt &nbsp;&mdash;&nbsp; 3,0
            </td>
          </tr>
          <tr>
            <td style={{ padding: "2px 0" }}>
              {grades[1]} - {grades[2] - 1} pkt &nbsp;&mdash;&nbsp; 3,5
            </td>
          </tr>
          <tr>
            <td style={{ padding: "2px 0" }}>
              {grades[2]} - {grades[3] - 1} pkt &nbsp;&mdash;&nbsp; 4,0
            </td>
          </tr>
          <tr>
            <td style={{ padding: "2px 0" }}>
              {grades[3]} - {grades[4] - 1} pkt &nbsp;&mdash;&nbsp; 4,5
            </td>
          </tr>
          <tr>
            <td style={{ padding: "2px 0" }}>
              {grades[4]} - {grades[5]} pkt &nbsp;&mdash;&nbsp; 5,0
            </td>
          </tr>
        </table>

        <div className="recipe-info">
          Zadanie z receptą - do zdobycia 10 pkt.
        </div>
      </div>
    </>
  );
}
