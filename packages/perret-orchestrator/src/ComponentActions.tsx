import type { LunaticComponentProps } from "@inseefr/lunatic";
import { useResponseState } from "./hooks/useResponseState.tsx";
import Styles from "./Orchestrator.module.css";

export function ComponentActions(props: LunaticComponentProps) {
  if (!("response" in props)) {
    return null;
  }
  const { state, collectedValue } = useResponseState(props.response.name);
  const resetToCollected = () => {
    props.handleChanges([
      {
        name: props.response.name,
        value: collectedValue,
        type: "COLLECTED",
      },
    ]);
  };

  return (
    <div className={Styles.OrchestratorActions}>
      <button
        type="button"
        onClick={resetToCollected}
        disabled={state === "COLLECTED"}
      >
        {state}
      </button>
      {state !== "COLLECTED" && (
        <>
          <input
            type="text"
            value={valueToString(collectedValue)}
            onChange={console.log}
          />
          <button type="button" onClick={resetToCollected}>
            Reset
          </button>
        </>
      )}
    </div>
  );
}

function valueToString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return "[" + value.map(valueToString).join(",") + "]";
  }
  return JSON.stringify(value);
}
