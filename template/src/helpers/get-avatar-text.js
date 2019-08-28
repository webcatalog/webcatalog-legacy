const getAvatarText = (id, name, order) => {
  if (id === 'add') return '+';
  if (name) return name[0];
  return order + 1;
};

export default getAvatarText;
