export type ServiceSlug =
  | 'software-development'
  | 'technical-support'
  | 'security-surveillance'
  | 'networks-infrastructure'
  | 'project-management'
  | 'iot';

export interface ServiceItem {
  slug: ServiceSlug;
  iconName: 'Code2' | 'Headset' | 'Cctv' | 'Network' | 'Workflow' | 'Cpu';
}

export const servicesData: ServiceItem[] = [
  {
    slug: 'software-development',
    iconName: 'Code2',
  },
  {
    slug: 'technical-support',
    iconName: 'Headset',
  },
  {
    slug: 'security-surveillance',
    iconName: 'Cctv',
  },
  {
    slug: 'networks-infrastructure',
    iconName: 'Network',
  },
  {
    slug: 'project-management',
    iconName: 'Workflow',
  },
  {
    slug: 'iot',
    iconName: 'Cpu',
  },
];
