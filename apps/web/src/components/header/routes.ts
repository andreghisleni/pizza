export const routes = () => ({
  ADMIN: [
    { href: '/app/dashboard', title: 'Dashboard' },
    { href: '/app/tickets', title: 'Ingressos' },
  ],
  DEFAULT: [
    { href: '/app/dashboard', shouldMatchExact: true, title: 'Dashboard' },
  ],
})
