export default {
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_.!@#$%^&*])[a-zA-Z0-9_.!@#$%^&*]{4,20}$/,
  USERNAME_REGEX: /^(?=.*[a-z])[a-z][a-z0-9_]{4,20}$/,
}
