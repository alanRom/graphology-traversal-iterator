/**
 * Graphology Traversal Utils
 * ===========================
 *
 * Miscellaneous utils used throughout the library.
 */
import AbstractGraph, { Attributes } from "graphology-types"

export class TraversalRecord {
  node: string;
  attributes: Attributes;
  depth: number;

  constructor(node: string, attr: Attributes, depth: number) {
      this.node = node;
      this.attributes = attr;
      this.depth = depth;
  }
}

export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export enum TraversalModes {
    In,
    Out,
    Inbound,
    Outbound,
    Directed,
    Undirected
}

export const getTraversalModeFromString = (mode:string) => {
    switch(mode.toLowerCase()){
        case 'in':
            return TraversalModes.In
        case 'out':
        return TraversalModes.Out
        case 'inbound':
            return TraversalModes.Inbound
        case 'directed':
            return TraversalModes.Directed
        case 'undirected':
            return TraversalModes.Undirected
        case 'outbound':
            return TraversalModes.Outbound
        default:
            throw new Error(
                'graphology-traversal/dfs: unsupported traversal mode.'
            )
    }
}

export const getNeighborsForNode = (graph: AbstractGraph, node: string, traversalMode: TraversalModes) => {
    switch(traversalMode){
        case TraversalModes.In:
            return graph.inNeighborEntries(node)
        case TraversalModes.Out:
            return graph.outNeighborEntries(node)
        case TraversalModes.Inbound:
            return graph.inboundNeighborEntries(node)
        case TraversalModes.Directed:
            return graph.directedNeighborEntries(node);
        case TraversalModes.Undirected:
            return graph.undirectedNeighborEntries(node);
        case TraversalModes.Outbound:
        default:
            return graph.outboundNeighborEntries(node)
    }
}