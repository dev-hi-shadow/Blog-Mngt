exports.generateJWTToken = (payload, expiresIn = 86400) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });
  return token;
};

exports.getTableFilters = (req = {}, params = {}) => {
  const {
    limit = null,
    offset = 0,
    order_by = "created_at",
    sort_by = "DESC",
  } = req.query;

  // Ensure limit and offset are integers and within a reasonable range
  const numericLimit = Math.max(1, Math.min(1000, parseInt(limit, 10)));
  const numericOffset = Math.max(0, parseInt(offset, 10));

  return {
    ...(limit ? { limit: numericLimit } : {}),
    offset: numericOffset,
    sort_by,
    order: [
      [
        ...order_by?.split(".")?.map((key, i, arr) => {
          if (arr?.length === 1) {
            return key;
          }
          return params?.orderArr?.filter((item) =>
            item?.as === key ? item : false
          )[0];
        }),
      ],
    ],
  };
};
