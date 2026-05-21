import { Types } from 'mongoose';
import { agentRefToUserId } from './property-agent.util';

describe('agentRefToUserId', () => {
  const id = new Types.ObjectId('507f1f77bcf86cd799439011');

  it('returns hex for ObjectId ref', () => {
    expect(agentRefToUserId(id)).toBe(id.toHexString());
  });

  it('returns hex for populated user-like document', () => {
    expect(
      agentRefToUserId({
        _id: id,
        name: 'A',
        email: 'a@b.com',
      }),
    ).toBe(id.toHexString());
  });

  it('returns hex for id string', () => {
    expect(agentRefToUserId(id.toHexString())).toBe(id.toHexString());
  });

  it('returns undefined for empty', () => {
    expect(agentRefToUserId(undefined)).toBeUndefined();
  });
});
