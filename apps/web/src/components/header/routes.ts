export const routes = () => ({
  ADMIN: [
    { href: '/app/dashboard', title: 'Dashboard' },
    { href: '/app/analytics', title: 'Analytics' },
    { href: '/app/scout-groups', title: 'Grupos escoteiros' },
  ],
  DEFAULT: [
    { href: '/app/scout-group', shouldMatchExact: true, title: 'Dashboard' },
    {
      href: '/app/scout-group/info',
      title: 'Grupo escoteiro',
    },
    { href: '/app/scout-group/members', title: 'Membros' },
  ],
})
