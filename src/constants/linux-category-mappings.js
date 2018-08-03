// https://github.com/quanglam2807/webcatalog-apps/ uses different categorizing approach from Linux.
// This will map the categories to the one specified on https://standards.freedesktop.org/menu-spec/latest/apa.html

/* eslint-disable quote-props */
const linuxCategoryMappings = {
  'Books': 'Other',
  'Business': 'Office',
  'Catalogs': 'Other',
  'Developer Tools': 'Development',
  'Education': 'Education',
  'Entertainment': 'Other',
  'Finance': 'Office',
  'Food & Drink': 'Other',
  'Games': 'Game',
  'Health & Fitness': 'Other',
  'Graphics & Design': 'Graphics',
  'Lifestyle': 'Other',
  'Kids': 'Other',
  'Magazines & Newspapers': 'Other',
  'Medical': 'Science;MedicalSoftware',
  'Music': 'AudioVideo;Music',
  'Navigation': 'Utility;Maps',
  'News': 'Other',
  'Photo & Video': 'AudioVideo',
  'Productivity': 'Office',
  'Reference': 'Other',
  'Shopping': 'Other',
  'Social Networking': 'Other',
  'Sports': 'Other',
  'Travel': 'Other',
  'Utilities': 'Utility',
};

export default linuxCategoryMappings;
