import {
  type LunaticChangesHandler,
  LunaticComponents,
  useLunatic,
} from "@inseefr/lunatic";
import "@inseefr/lunatic/lib/main.css";

import { useCallback, useMemo } from "react";
import Styles from "./Orchestrator.module.css";
import { objectToLunaticData } from "./functions/lunatic.ts";
import { QuestionnaireNavigation } from "./QuestionnaireNavigation.tsx";
import { ComponentWrapper } from "./ComponentWrapper.tsx";
import type { LunaticSlotComponents } from "@inseefr/lunatic/lib/components/shared/HOC/slottableComponent";
import {
  useUpdateResponse,
  VariablesContextProvider,
} from "./hooks/useResponseState.tsx";

type Props = {
  source: any;
  data: Record<string, unknown>;
};

const slots = {
  ComponentWrapper: ComponentWrapper,
} as Partial<LunaticSlotComponents>;

export function Orchestrator({ source, data }: Props) {
  return (
    <VariablesContextProvider data={data}>
      <LunaticOrchestrator source={source} data={data} />
    </VariablesContextProvider>
  );
}

function LunaticOrchestrator({ source, data }: Props) {
  const updateResponse = useUpdateResponse();
  const onChange: LunaticChangesHandler = useCallback(
    (changes) => {
      changes.forEach((change) => {
        updateResponse(change.name, change.value, change.type ?? "EDITED");
      }, []);
    },
    [updateResponse],
  );
  const { getComponents, Provider, overview, goToPage } = useLunatic(
    source,
    useMemo(() => objectToLunaticData(data), [data]),
    {
      initialPage: "1",
      onChange,
      withOverview: true,
    },
  );

  return (
    <Provider>
      <div className={Styles.OrchestratorWrapper}>
        <div className={Styles.OrchestratorNavigation}>
          <QuestionnaireNavigation
            items={overview}
            onClick={(page) => goToPage({ page })}
          />
        </div>
        <div>
          <LunaticComponents slots={slots} components={getComponents()} />
        </div>
      </div>
    </Provider>
  );
}
