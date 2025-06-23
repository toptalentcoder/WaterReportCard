import { LOCAL_STORAGE } from "./constants";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// export function pathnameCheck(href: string, pathname: string) {
//   if (pathname.includes(href) && href !== "/") {
//     return true;
//   } else {
//     return false;
//   }
// }