import Graph, {Attributes} from 'graphology-types';
import {TraversalOptions} from './types';

export function dfs<N extends Attributes = Attributes>(
  graph: Graph<N>,
  options?: TraversalOptions
): Generator<[string, Attributes, number], void, unknown>;

export function dfsFromNode<N extends Attributes = Attributes>(
  graph: Graph<N>,
  node: unknown,
  options?: TraversalOptions
): Generator<[string, Attributes, number], void, unknown>;
