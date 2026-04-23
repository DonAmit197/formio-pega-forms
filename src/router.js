
import Navigo from "navigo";
// Use hash mode to avoid server rewrites while prototyping.
// If you have rewrites, switch to: new Navigo("/", { hash: false });
export const router = new Navigo("/");