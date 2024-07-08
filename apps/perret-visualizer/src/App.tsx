import {Orchestrator} from '@platine/perret-orchestrator'
import source from './source.json'

const data = {
    NB: 2
}

export function App () {
    return <Orchestrator source={source} data={data}/>
}
