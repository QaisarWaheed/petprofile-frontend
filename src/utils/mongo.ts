export function withMongoId<T extends object>(
  doc: T & { _id?: unknown },
): T & { id: string } {
  return { ...doc, id: String(doc._id) } as T & { id: string };
}
