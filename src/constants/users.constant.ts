export const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
  ERROR: {
    username: 'error_user',
    password: 'secret_sauce',
  },
  VISUAL: {
    username: 'visual_user',
    password: 'secret_sauce',
  },
  INVALID: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
} as const;

export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  USERNAME_REQUIRED: 'Epic sadface: Username is required',
  PASSWORD_REQUIRED: 'Epic sadface: Password is required',
  FIRST_NAME_REQUIRED: 'Error: First Name is required',
  LAST_NAME_REQUIRED: 'Error: Last Name is required',
  POSTAL_CODE_REQUIRED: 'Error: Postal Code is required',
} as const;
