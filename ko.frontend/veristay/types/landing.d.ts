export interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

export interface NavLink {
  key: string;
  href: string;
  label: string;
}

export type NavLinkProps = {
  links: NavLink[];
};
