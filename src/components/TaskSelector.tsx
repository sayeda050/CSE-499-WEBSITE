
import { TASKS } from "../data/verifiedResearch";
import type { AnalysisForm, TaskId } from "../types/inference";

interface Props {
  form: AnalysisForm;
  onChange: (value: AnalysisForm) => void;
}

export default function TaskSelector({
  form,
  onChange,
}: Props) {
  function setTask(task: TaskId) {
    onChange({
      ...form,
      task,
      question: "",
    });
  }

  return (
    <div className="task-form">
      <div className="field">
        <label htmlFor="research-task">Research task</label>

        <select
          id="research-task"
          value={form.task}
          onChange={(event) =>
            setTask(event.target.value as TaskId)
          }
        >
          {TASKS.map((task) => (
            <option key={task.id} value={task.id}>
              {task.id} — {task.title}
            </option>
          ))}
        </select>
      </div>

      <div className="task-description">
        {
          TASKS.find((task) => task.id === form.task)
            ?.description
        }
      </div>

      <div className="field">
        <label htmlFor="research-question">
          Video question
        </label>

        <textarea
          id="research-question"
          rows={3}
          value={form.question}
          onChange={(event) =>
            onChange({
              ...form,
              question: event.target.value,
            })
          }
          placeholder="Enter a question supported by the selected video and research task."
        />
      </div>

      {form.task === "MCQ" && (
        <fieldset className="options-fieldset">
          <legend>Four answer choices</legend>

          {form.options.map((option, index) => (
            <div className="option-field" key={index}>
              <label htmlFor={`option-${index}`}>
                {String.fromCharCode(65 + index)}
              </label>

              <input
                id={`option-${index}`}
                value={option}
                onChange={(event) => {
                  const next = [...form.options] as
                    AnalysisForm["options"];

                  next[index] = event.target.value;

                  onChange({
                    ...form,
                    options: next,
                  });
                }}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
              />
            </div>
          ))}
        </fieldset>
      )}

      <p className="microcopy">
        Questions and options are input values only.
        This interface does not generate reference labels
        or change the frozen research methods.
      </p>
    </div>
  );
}
