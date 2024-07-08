import type {LunaticData} from "@inseefr/lunatic";

export function objectToLunaticData (data: Record<string, unknown>): LunaticData {
    return {
        COLLECTED: Object.fromEntries(Object.entries(data).map(([variableName, value]) => ([
            variableName,
            {COLLECTED: value}
        ])))
    }
}
