export type data = {
    allCombinationsJson : allCombinationsJson
}

export type allCombinationsJson = {
    nodes: Nodes[]
}

export type Nodes = {
    combinations: combinations[]
    size: number
}

export type combinations = {

    combination: []
    total: number
}

