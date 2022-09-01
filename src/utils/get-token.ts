export const getToken = async (overlayId: string, refresh = false) => {
  return fetch(
    `https://sn-token.sgmn.workers.dev/?overlayId=${overlayId}`
  ).then((res) => res.text());
};
