export function getErrorObject(error: any) {
  return {
    response: null,
    error: {
      code: error?.response?.status || 500,
      message: error?.response?.data?.message || "An error occurred",
    },
  };
}


export function getResponseNotExistErrorObject() {
  return {
    response: null,
    error: {
      code: 404,
      message: "Data not found",
    },
  };
}