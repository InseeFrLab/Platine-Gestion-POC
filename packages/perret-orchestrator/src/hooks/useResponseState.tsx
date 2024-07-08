import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";
import { produce } from "immer";

type VariableChange = {
  type: "COLLECTED" | "EDITED" | "FORCED";
  value: unknown;
  timestamp: number;
};

function createStoreFromData(data: Record<string, unknown>) {
  const variables = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      [
        {
          type: "COLLECTED",
          value: v,
          timestamp: new Date().getTime(),
        },
      ] satisfies VariableChange[],
    ]),
  );
  return createStore(
    combine(
      {
        variables: variables,
      },
      (set) => ({
        updateVariable: (
          name: string,
          value: unknown,
          mode: VariableChange["type"] = "EDITED",
        ) =>
          set(
            produce((state) => {
              // This is a new variable (not already tracked)
              if (!(name in state.variables)) {
                state.variables[name] = [];
              }

              const changes = state.variables[name];
              const change = {
                type: mode,
                value,
                timestamp: new Date().getTime(),
              };
              // The change has the same type has the last change, update it instead
              if (
                changes.length > 0 &&
                changes[changes.length - 1].type === mode
              ) {
                changes[changes.length - 1] = change;
              } else if (value !== changes[changes.length - 1].value) {
                changes.push(change);
              }
            }),
          ),
      }),
    ),
  );
}

const VariablesContext = createContext<ReturnType<typeof createStoreFromData>>(
  createStoreFromData({}),
);

export const VariablesContextProvider = ({
  data,
  children,
}: PropsWithChildren<{ data: Record<string, unknown> }>) => {
  const store = useMemo(() => createStoreFromData(data), [data]);
  return (
    <VariablesContext.Provider value={store}>
      {children}
    </VariablesContext.Provider>
  );
};

export function useResponseState(variableName: string): {
  state: "COLLECTED" | "EDITED" | "FORCED";
  collectedValue: unknown;
} {
  const store = useContext(VariablesContext);
  const changes = useStore(
    store,
    (state) => state.variables[variableName] ?? [],
  );

  if (changes.length === 0) {
    return {
      state: "COLLECTED",
      collectedValue: null,
    };
  }

  const firstValue = changes[0];
  const lastValue = changes.at(-1)!;

  return {
    state: lastValue.type,
    collectedValue: firstValue.type === "COLLECTED" ? firstValue.value : null,
  };
}

export function useUpdateResponse() {
  const store = useContext(VariablesContext);
  return useStore(store, (state) => state.updateVariable);
}
