export const categories = {
  residential: 'Residencial',
  commercial: 'Comercial',
  industrial: 'Industrial',
  rural: 'Rural',
} as const;
export const states = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;
export type Category = keyof typeof categories;
export type ProjectImage = {
  id: string;
  project_id: string;
  storage_path: string;
  alt_text: string;
  caption: string;
  sort_order: number;
  created_at: string;
  url?: string;
};
export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: Category;
  city: string;
  state: string;
  power_kwp: number | null;
  modules_count: number | null;
  module_model: string;
  module_power_w: number | null;
  inverters_count: number | null;
  inverter_model: string;
  estimated_monthly_generation: number | null;
  estimated_monthly_savings: number | null;
  estimated_annual_savings: number | null;
  estimated_reduction_percentage: number | null;
  challenge: string;
  solution: string;
  results: string;
  completion_date: string | null;
  status: 'draft' | 'published';
  featured: boolean;
  cover_image: string | null;
  before_image: string | null;
  after_image: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  project_images: ProjectImage[];
  cover_url?: string;
};
