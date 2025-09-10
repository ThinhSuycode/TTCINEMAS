import { PageOnly } from "../components";
import {
  Home,
  ListGenres,
  MovieDetail,
  MovieUpComing,
  Profile,
  User,
  Favorite,
  PlayList,
  MovieAll,
  WalletTotal,
} from "../components/pages";
import { config } from "../config";
const publicRoute = [
  { path: config.routes.Home, component: Home },

  {
    path: config.routes.MovieDetail,
    component: MovieDetail,
    check: true,
  },
  {
    path: config.routes.ListGenres,
    component: ListGenres,
    check: true,
  },
  {
    path: config.routes.MovieUpComing,
    component: MovieUpComing,
    page: PageOnly,
  },
  {
    path: config.routes.MovieAll,
    component: MovieAll,
    page: PageOnly,
  },
  { path: config.routes.Profile, component: Profile, page: User },
  { path: config.routes.Favorite, component: Favorite, page: User },
  { path: config.routes.PlayList, component: PlayList, page: User },
  { path: config.routes.WalletTotal, component: WalletTotal, page: PageOnly },
];
const privateRoute = [];
export { publicRoute, privateRoute };
