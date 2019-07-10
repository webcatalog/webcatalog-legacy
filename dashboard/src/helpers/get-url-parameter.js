// https://stackoverflow.com/a/21903119
const getUrlParameter = (sParam) => {
  const sPageURL = decodeURIComponent(window.location.search.substring(1));
  const sURLVariables = sPageURL.split('&');

  for (let i = 0; i < sURLVariables.length; i += 1) {
    const sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }

  return null;
};

export default getUrlParameter;
