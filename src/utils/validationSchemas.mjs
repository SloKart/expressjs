





export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Username must be between 3 and 10 characters",
    },

    notEmpty: {
      errorMessage: "Username is required",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: true,
  },
};

