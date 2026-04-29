export type CustomerLogo = {
  name: string;
  logoSrc: string;
  href?: string;
};

// Empty until real approved logos are provided.
// See /docs/CUSTOMER_LOGOS.md for instructions.
const customerLogos: CustomerLogo[] = [];

export default customerLogos;
