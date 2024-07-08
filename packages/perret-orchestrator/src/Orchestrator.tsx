import {
  type LunaticChangesHandler,
  LunaticComponents,
  useLunatic,
} from "@inseefr/lunatic";
import "@inseefr/lunatic/lib/main.css";

import { useCallback, useMemo } from "react";
import { objectToLunaticData } from "./functions/lunatic.ts";

type Props = {
  source: any;
  data: Record<string, unknown>;
};

export function Orchestrator({ source, data }: Props) {
  const onChange: LunaticChangesHandler = useCallback(() => {}, []);
  const { getComponents, Provider } = useLunatic(
    source,
    useMemo(() => objectToLunaticData(data), [data]),
    {
      initialPage: "1",
      onChange,
    },
  );

  return (
    <div>
      <Provider>
        <LunaticComponents components={getComponents()} />
      </Provider>
    </div>
  );
}
