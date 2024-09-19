export const routes = () => ({
  ADMIN: [
    { href: '/app/dashboard', title: 'Dashboard' },
    { href: '/app/tickets', title: 'Ingressos', shouldMatchExact: true },
    { href: '/app/tickets-after-inport', title: 'Ingressos após importação' },
  ],
  DEFAULT: [
    { href: '/app/dashboard', shouldMatchExact: true, title: 'Dashboard' },
    { href: '/app/tickets-after-inport', title: 'Ingressos após importação' },
  ],
})
