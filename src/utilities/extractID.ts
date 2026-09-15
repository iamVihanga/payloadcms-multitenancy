export const extractID = <T extends { id: number | string }>(objectOrID: T | T['id']): T['id'] =>
  objectOrID && typeof objectOrID === 'object' ? objectOrID.id : objectOrID
