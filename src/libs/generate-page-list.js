const generatePageList = (currentPage, totalPage) => {
  const pages = [currentPage];

  if (currentPage - 1 >= 1) pages.unshift(currentPage - 1);

  if (currentPage + 1 <= totalPage) pages.push(currentPage + 1);

  if (currentPage + 2 === totalPage) pages.push(totalPage);
  if (currentPage + 3 <= totalPage) pages.push(0, totalPage);

  if (currentPage - 2 === 1) pages.unshift(1);
  else if (currentPage - 3 >= 1) pages.unshift(1, 0);

  return pages;
};

export default generatePageList;
