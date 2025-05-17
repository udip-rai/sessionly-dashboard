export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
  order?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  expertCount: number;
  order?: number;
}

export interface ExpertCategory {
  categoryId: string;
  categoryName: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

// Mock data that can be imported where needed
export const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Software Development',
    description: 'Programming, software architecture, and development practices',
    subcategories: [
      {
        id: 'sub1',
        name: 'Web Development',
        description: 'Frontend and backend web development',
        expertCount: 45
      },
      {
        id: 'sub2',
        name: 'Mobile Development',
        description: 'iOS, Android, and cross-platform development',
        expertCount: 32
      },
      {
        id: 'sub3',
        name: 'System Design',
        description: 'Architecture and system design principles',
        expertCount: 28
      }
    ]
  },
  {
    id: 'cat2',
    name: 'Data Science',
    description: 'Data analysis, machine learning, and statistics',
    subcategories: [
      {
        id: 'sub4',
        name: 'Machine Learning',
        description: 'ML algorithms, deep learning, and AI',
        expertCount: 28
      },
      {
        id: 'sub5',
        name: 'Data Analytics',
        description: 'Data visualization and business analytics',
        expertCount: 35
      },
      {
        id: 'sub6',
        name: 'Big Data',
        description: 'Processing and analyzing large datasets',
        expertCount: 22
      }
    ]
  },
  {
    id: 'cat3',
    name: 'Cloud Computing',
    description: 'Cloud platforms, services, and architecture',
    subcategories: [
      {
        id: 'sub7',
        name: 'AWS',
        description: 'Amazon Web Services expertise',
        expertCount: 40
      },
      {
        id: 'sub8',
        name: 'Azure',
        description: 'Microsoft Azure platform expertise',
        expertCount: 35
      },
      {
        id: 'sub9',
        name: 'DevOps',
        description: 'DevOps practices and tools',
        expertCount: 30
      }
    ]
  }
];