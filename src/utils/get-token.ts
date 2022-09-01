export const getToken = async (overlayId: string, refresh = false) => {
  let token = localStorage.getItem("token");

  if (!token || refresh) {
    token = await fetch(
      `https://sn-token.sgmn.workers.dev/?overlayId=${overlayId}`
    ).then((res) => res.text());
    localStorage.setItem("token", token as string);
  }

  return token;
};
