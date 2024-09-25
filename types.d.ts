import {Attributes} from 'graphology-types';
import { TraversalModes } from './utils';

export type TraversalCallback<NodeAttributes extends Attributes = Attributes> =
  (key: string, attributes: NodeAttributes, depth: number) => boolean | void;

export type TraversalMode =
  | 'in'
  | 'out'
  | 'directed'
  | 'undirected'
  | 'inbound'
  | 'outbound';

export type TraversalOptions = {
  mode?: TraversalMode | TraversalModes;
};
