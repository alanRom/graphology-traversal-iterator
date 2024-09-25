import Graph, {Attributes} from 'graphology-types';
import {TraversalOptions} from './types';

export function bfs<N extends Attributes = Attributes>(
  graph: Graph<N>,
  options?: TraversalOptions
): Generator<[string, Attributes, number], void, unknown>;

export function bfsFromNode<N extends Attributes = Attributes>(
  graph: Graph<N>,
  node: unknown,
  options?: TraversalOptions
): Generator<[string, Attributes, number], void, unknown>;
