import categories from '../constants/categories';

const getSingularLabel = category =>
  categories.find(c => c.value === category).singularLabel || '';

export default getSingularLabel;
