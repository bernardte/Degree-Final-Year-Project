// 识别常见的动态 ID（Mongo ObjectId / UUID / 数字 ID）
export const normalizeAction = (action) => {
  if (!action) return action;

  // UUID v4 格式
  const uuidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;

  // MongoDB ObjectId (24 hex chars)
  const objectIdRegex = /\b[0-9a-f]{24}\b/gi;

  // 数字 ID
  const numberIdRegex = /\/\d+(?=\/|$)/g;

  return action
    .replace(uuidRegex, ":uuid")
    .replace(objectIdRegex, ":objectId")
    .replace(numberIdRegex, "/:id");
};
