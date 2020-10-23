export interface CategorySort {
  displayName: string;
  sortName: string;
}

export const categorySort: CategorySort[] = [
  {
    displayName: 'Title descending',
    sortName: 'original_title.desc'
  },
  {
    displayName: 'Title ascending',
    sortName: 'original_title.asc'
  },
  {
    displayName: 'Release date descending',
    sortName: 'release_date.desc'
  },
  {
    displayName: 'Release date ascending',
    sortName: 'release_date.asc'
  },
  {
    displayName: 'Popularity descending',
    sortName: 'popularity.desc'
  },
  {
    displayName: 'Popularity ascending',
    sortName: 'popularity.asc'
  },
  {
    displayName: 'Revenue descending',
    sortName: 'revenue.desc'
  },
  {
    displayName: 'Revenue ascending',
    sortName: 'revenue.asc'
  }
];
