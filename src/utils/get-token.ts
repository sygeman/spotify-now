export const getToken = async (overlayId: string) => {
  return fetch(
    `https://sn-token.sgmn.workers.dev/?overlayId=${overlayId}`
  ).then((res) => res.text());
};
