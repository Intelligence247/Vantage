import { Types } from 'mongoose';

/**
 * `Property.agent` may be an ObjectId or a populated User document.
 * Use this when comparing to JWT `sub` (user id string).
 */
export function agentRefToUserId(agent: unknown): string | undefined {
  if (agent == null) return undefined;
  if (typeof agent === 'string' && Types.ObjectId.isValid(agent)) {
    return new Types.ObjectId(agent).toHexString();
  }
  if (agent instanceof Types.ObjectId) {
    return agent.toHexString();
  }
  if (typeof agent === 'object' && agent !== null && '_id' in agent) {
    const id = (agent as { _id: unknown })._id;
    if (id instanceof Types.ObjectId) return id.toHexString();
    if (typeof id === 'string' && Types.ObjectId.isValid(id)) {
      return new Types.ObjectId(id).toHexString();
    }
  }
  return undefined;
}
