//动态引入组件

const LoginIndex = () => import("../pages/login")
const HomeIndex = () => import("../pages/home")
const SettingIndex = () => import("../pages/setting")
const ProjectIndex = () => import("../pages/project")
const ProjectEditIndex = () => import("../pages/project/edit")
const materialIndex = () => import("../pages/material")
const materialNewIndex = () => import("../pages/material/new")
const supplyIndex = () => import("../pages/supply")
const supplyNewlIndex = () => import("../pages/supply/new")
const caigouIndex = () => import("../pages/caigou")
const caigouNewlIndex = () => import("../pages/caigou/new")
const caigouDetailIndex = () => import("../pages/caigou/detail")
const shouhuoIndex = () => import("../pages/shouhuo")
const shouhuoNewlIndex = () => import("../pages/shouhuo/new")

export default [
  {path: "", redirect: "/login"},
  {path: "/login", component: LoginIndex, meta:{layout: "blank-layout"}},
  {path: "/home", component: HomeIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/setting", component: SettingIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/project/list", component: ProjectIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/project/edit", component: ProjectEditIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/material", component: materialIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/material/new", component: materialNewIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/supply", component: supplyIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/supply/new", component: supplyNewlIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/caigou", component: caigouIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/caigou/new", component: caigouNewlIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/caigou/detail", component: caigouDetailIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/shouhuo", component: shouhuoIndex, meta: {requireLogin: true, layout: "page-layout"}},
  {path: "/shouhuo/new", component: shouhuoNewlIndex, meta: {requireLogin: true, layout: "page-layout"}},
]