import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import SeoSettings from "../components/Forms/SeoSettings";
import HealthCheck from './HealthCheck';
import RegisterToSearchEngines from './RegisterToSearchEngines';
import SSLPage from './SSLPage';
import Button from 'flarum/common/components/Button';
import Sitemap from './Sitemap';

export default class SettingsPage extends ExtensionPage {
  trans(key) {
    return app.translator.trans(`vadkuz-flarum2-seo.admin.menu.${key}`);
  }

  content() {
    const page = m.route.param().page || 'health';
    
    return (
      <div className="ExtensionPage-settings FlarumSEO">
        <div className={"seo-menu"}>
          <div className={"container"}>
            {this.menuButtons(page)}
          </div>
        </div>

        <div className="container FlarumSeoPage-container">
          {this.pageContent(page)}
        </div>
      </div>
    );
  }

  // Return button menus
  menuButtons(page) {
    return [
      Button.component({
        className: `Button ${page === 'health' ? 'item-selected' : ''}`,
        onclick: () => m.route.set(
          app.route('extension', {
            id: 'vadkuz-flarum2-seo'
          })
        ),
        icon: 'fas fa-heartbeat',
      }, this.trans('health_check')),
      Button.component({
        className: `Button ${page === 'settings' ? 'item-selected' : ''}`,
        onclick: () => m.route.set(
          app.route('extension', {
            id: 'vadkuz-flarum2-seo',
            page: 'settings'
          })
        ),
        icon: 'fas fa-cogs',
      }, this.trans('seo_settings')),
      Button.component({
        className: `Button ${page === 'sitemap' ? 'item-selected' : ''}`,
        onclick: () => m.route.set(
          app.route('extension', {
            id: 'vadkuz-flarum2-seo',
            page: 'sitemap'
          })
        ),
        icon: 'fas fa-sitemap',
      }, this.trans('sitemap_information')),
      Button.component({
        className: `Button ${page === 'search-engines' ? 'item-selected' : ''}`,
        onclick: () => m.route.set(
          app.route('extension', {
            id: 'vadkuz-flarum2-seo',
            page: 'search-engines'
          })
        ),
        icon: 'fas fa-search',
      }, this.trans('search_engine_information')),
      Button.component({
        className: `Button ${page === 'ssl' ? 'item-selected' : ''}`,
        onclick: () => m.route.set(
          app.route('extension', {
            id: 'vadkuz-flarum2-seo',
            page: 'ssl'
          })
        ),
        icon: 'fas fa-shield-alt',
      }, this.trans('set_up_ssl'))
    ];
  }


  pageContent(page) {
    if(page === 'search-engines') {
      return <RegisterToSearchEngines />
    }else if(page === "settings") {
      return <SeoSettings />
    }else if(page === "ssl") {
      return <SSLPage />
    }else if(page === "sitemap") {
      return <Sitemap />
    }

    // Default healthcheck
    return <HealthCheck />
  }
}
