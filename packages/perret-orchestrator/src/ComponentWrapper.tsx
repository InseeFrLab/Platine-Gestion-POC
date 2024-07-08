import type { LunaticComponentProps } from "@inseefr/lunatic";
import { ComponentActions } from "./ComponentActions.tsx";
import type { ReactNode } from "react";
import Styles from "./Orchestrator.module.css";

export const ComponentWrapper = (props: LunaticComponentProps) => {
  if (!("children" in props)) {
    return null;
  }

  if (!("response" in props) && !("responses" in props)) {
    return props.children;
  }

  return (
    <div className={Styles.OrchestratorComponent}>
      <div>{props.children as ReactNode}</div>
      <ComponentActions {...props} />
    </div>
  );
};
