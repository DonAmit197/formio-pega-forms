import './style.css'
import { router } from "./router";
import { Home } from './pages/Home/Home';
import { multiPage } from './pages/multi-page-form';


window.addEventListener('load', () => {
  router.on('/', () => {
    Home();
  });
  router.on('/multi-page-form', () => {

    multiPage();

  });

  router.notFound(function () { Home(); });
  router.resolve();
});


