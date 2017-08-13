import categories from '../constants/categories';

const getCategoryLabel = categoryId =>
  categories.find(c => c.value === categoryId).label || '';

export default getCategoryLabel;
