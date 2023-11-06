export const required = (value) => value.trim() !== "";

export const length = (config) => (value) => {
  let isValid = false;
  if (config.min) {
    isValid = value.length >= config.min;
  }
  if (config.max) {
    isValid = value.length <= config.min;
  }
  return isValid;
};

export const isEmail = (value) =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
  );
