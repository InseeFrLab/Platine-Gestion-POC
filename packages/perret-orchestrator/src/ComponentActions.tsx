import type { LunaticComponentProps } from "@inseefr/lunatic";
import { useResponseState } from "./hooks/useResponseState.tsx";
import { memo } from "react";

export function ComponentActions(props: LunaticComponentProps) {
  if (!("response" in props)) {
    return null;
  }

  return (
    <div>
      <Demo name={props.response.name} />
    </div>
  );
}

export const Demo = memo<{ name: string }>(({ name }) => {
  const { state, collectedValue } = useResponseState(name);

  return (
    <div>
      <button type="button">{state}</button>
      <input type="text" value={collectedValue} onChange={console.log} />
    </div>
  );
});
