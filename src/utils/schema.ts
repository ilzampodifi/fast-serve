export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const HHMM = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

export const HHMM_VALIDATOR = (hhmm: string) => HHMM.test(hhmm);
