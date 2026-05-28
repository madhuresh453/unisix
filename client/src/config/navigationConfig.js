import {
  Activity,
  Award,
  BadgeCheck,
  BookOpen,
  CircuitBoard,
  CreditCard,
  Flag,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Lock,
  Receipt,
  Bell,
  ScrollText,
  Settings,
  Shield,
  Tags,
  Trophy,
  Users,
  Wallet
} from "lucide-react";

const adminRoles = new Set(["super_admin", "admin", "moderator", "content_manager"]);

function isAdmin(user) {
  return Boolean(user?.adminAccess || adminRoles.has(user?.role));
}

function hasPremium(user) {
  const plan = String(user?.subscriptionPlan || "free").toLowerCase();
  return ["premium", "pro", "enterprise"].includes(plan);
}

export function getMainNavigation({ isAuthenticated }) {
  const common = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "CTF", href: "/ctf" },
    {
      label: "Academy",
      group: true,
      items: [
        { label: "Labs", href: "/labs" },
        { label: "Rooms", href: "/rooms" },
        { label: "Courses", href: "/courses" },
        { label: "Workshops", href: "/workshops" },
        { label: "Learning Paths", href: "/paths", premium: true, lockedLabel: "Soon" },
        { label: "Dashboard", href: "/dashboard/learning" },
        { label: "Certificates", href: "/dashboard/certificates", premium: true }
      ]
    },
    { label: "Mentors", href: "/mentors" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Writeups", href: "/writeups" },
    { label: "Sponsors", href: "/sponsors" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" }
  ];

  if (!isAuthenticated) return common;
  return common;
}

export function getProfileNavigation({ user, isAuthenticated }) {
  if (!isAuthenticated) return [];

  const items = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Learning", href: "/dashboard/learning" },
    { label: "Certificates", href: "/dashboard/certificates", premium: true },
    { label: "Payments", href: "/dashboard/payments" },
    { label: "Subscriptions", href: "/dashboard/subscriptions" },
    { label: "Notifications", href: "/dashboard/notifications" }
  ];

  if (isAdmin(user)) {
    items.push({ label: "Admin Panel", href: "/admin/dashboard" });
    items.push({ label: "Learning CMS", href: "/admin/labs" });
  }

  return items;
}

export function getDashboardNavigation({ user }) {
  const premium = hasPremium(user);
  return [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Learning Overview", href: "/dashboard/learning", icon: GraduationCap },
    { label: "My Courses", href: "/dashboard/courses", icon: BookOpen },
    { label: "My Labs", href: "/dashboard/labs", icon: FlaskConical },
    { label: "My Rooms", href: "/dashboard/rooms", icon: Shield },
    { label: "Workshops", href: "/dashboard/workshops", icon: Users },
    { label: "Certificates", href: "/dashboard/certificates", icon: ScrollText, premium: true, locked: !premium },
    { label: "Progress", href: "/dashboard/progress", icon: Trophy },
    { label: "Bookmarks", href: "/dashboard/bookmarks", icon: BadgeCheck },
    { label: "Payments", href: "/dashboard/payments", icon: Receipt },
    { label: "Subscriptions", href: "/dashboard/subscriptions", icon: Wallet },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { label: "Activity", href: "/dashboard/activity", icon: Activity },
    { label: "Submissions", href: "/dashboard/submissions", icon: Flag },
    { label: "Settings", href: "/dashboard/settings", icon: Settings }
  ];
}

export function getAdminNavigation() {
  return [
    { label: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Labs CMS", href: "/admin/labs", icon: FlaskConical },
    { label: "Rooms CMS", href: "/admin/rooms", icon: Shield },
    { label: "Courses CMS", href: "/admin/courses", icon: BookOpen },
    { label: "Workshops CMS", href: "/admin/workshops", icon: Users },
    { label: "Offers & Pricing", href: "/admin/offers", icon: Tags },
    { label: "Analytics", href: "/admin/analytics", icon: CircuitBoard },
    { label: "Media Library", href: "/admin/media", icon: BadgeCheck },
    { label: "Certificates", href: "/admin/certificates", icon: ScrollText },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: Wallet },
    { label: "Learning Paths", href: "/admin/paths", icon: Trophy },
    { label: "Mentors", href: "/admin/mentors", icon: Users },
    { label: "Learning Analytics", href: "/admin/dashboard", icon: CircuitBoard }
  ];
}

export function isNavItemActive(pathname, href) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function isAdminUser(user) {
  return isAdmin(user);
}

export function getLockState(item, user) {
  if (!item?.premium) return { locked: false };
  return { locked: !hasPremium(user), icon: Lock };
}
