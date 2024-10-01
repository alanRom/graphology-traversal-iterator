/**
 * Graphology Traversal Utils
 * ===========================
 *
 * Miscellaneous utils used throughout the library.
 */
import AbstractGraph, { Attributes } from "graphology-types";
export declare class TraversalRecord {
    node: string;
    attributes: Attributes;
    depth: number;
    constructor(node: string, attr: Attributes, depth: number);
}
export declare function capitalize(string: string): string;
export declare enum TraversalModes {
    In = 0,
    Out = 1,
    Inbound = 2,
    Outbound = 3,
    Directed = 4,
    Undirected = 5
}
export declare const getTraversalModeFromString: (mode: string) => TraversalModes;
export declare const getNeighborsForNode: (graph: AbstractGraph, node: string, traversalMode: TraversalModes) => IterableIterator<import("graphology-types").NeighborEntry<Attributes>>;
