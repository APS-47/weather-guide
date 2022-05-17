const Home = () => import("@/views/Home/Home");

const About = () => import("@/views/About/About");
const Profile = () => import("@/views/Profile/Profile");

const route = [
  {
    path: "",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    children: [],
  },
  {
    path: "about",
    name: "About",
    component: About,
  },
  {
    path: "profile",
    name: "Profile",
    component: Profile,
  },
];
export default route;
