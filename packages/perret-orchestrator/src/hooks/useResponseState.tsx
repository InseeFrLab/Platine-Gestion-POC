// On veut les valeur collectées
// On veut les valeur éditées
// On veut mettre à jour au fil du temps

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

type VariableState = "COLLECTED" | "EDITED" | "FORCED";

type Store = {
  [variableName: string]: {
    type: VariableState;
    value: unknown;
    timestamp: number;
  }[];
};

const buildStore = (data: Record<string, unknown>) => {
  const variables = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      [
        {
          type: "COLLECTED",
          value: v,
          timestamp: new Date().getTime(),
        },
      ],
    ]),
  ) satisfies Store;
  const target = new EventTarget();
  type Events = {
    change: { name: string };
  };

  return {
    on<T extends keyof Events>(
      eventName: T,
      cb: (args: { detail: Events[T] }) => void,
    ) {
      console.log("store on listened");
      target.addEventListener(eventName, cb);
      return () => target.removeEventListener(eventName, cb);
    },
    updateVariable(
      name: string,
      value: unknown,
      mode: VariableState = "EDITED",
    ) {
      if (!(name in variables)) {
        variables[name] = [];
      }
      const changes = [...variables[name]];
      const change = {
        type: mode,
        value,
        timestamp: new Date().getTime(),
      };
      // The change has the same type has the last change, update it instead
      if (changes.length > 0 && changes[changes.length - 1].type === mode) {
        changes[changes.length - 1] = change;
      } else {
        changes.push(change);
      }
      variables[name] = changes;
      target.dispatchEvent(new CustomEvent("change", { detail: { name } }));
    },
    getChanges(name: string) {
      return variables[name] ?? [];
    },
  };
};

const ChangesContext = createContext(buildStore({}));

export function useResponseState(name: string): {
  state: "COLLECTED" | "EDITED" | "FORCED";
  collectedValue: unknown;
} {
  const store = useContext(ChangesContext);

  const values = useSyncExternalStore(
    useCallback((callback) => {
      return store.on("change", (event) => {
        if (event.detail.name === name) {
          callback();
        }
      });
    }, []),
    useCallback(() => store.getChanges(name), []),
  );

  console.log("store", name, values);

  if (values.length === 0) {
    return {
      state: "COLLECTED",
      collectedValue: null,
    };
  }

  const firstValue = values[0];
  const lastValue = values.at(-1)!;

  return {
    state: lastValue.type,
    collectedValue: firstValue.type === "COLLECTED" ? firstValue.value : null,
  };
}

export function useUpdateResponse() {
  return useContext(ChangesContext).updateVariable;
}

export function VariablesChangesContext({
  data,
  children,
}: PropsWithChildren<{ data: Record<string, unknown> }>) {
  return (
    <ChangesContext.Provider value={useMemo(() => buildStore(data), [data])}>
      {children}
    </ChangesContext.Provider>
  );
}
