export const company = {
  companyName: 'FM SOLAR',
  slogan: 'Energia Sustentável',
  phone: '(63) 98439-0205',
  phoneRaw: '+5563984390205',
  whatsapp: '5563984390205',
  instagram: '@fmsolar.to',
  instagramUrl: 'https://instagram.com/fmsolar.to',
  logo: '/Logo 3D Dourado FM Solar.png',
  logoWidth: 2172,
  logoHeight: 724,
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
};
export function whatsappUrl(message = 'Olá! Quero um orçamento de energia solar com a FM SOLAR.') {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
