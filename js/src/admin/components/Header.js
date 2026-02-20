import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';

export default class Header extends Component {
    trans(key) {
        return app.translator.trans(`vadkuz-flarum2-seo.admin.header.${key}`);
    }

    view() {
        return (
            <div className="seo-header container">
                <div className="pull-right">
                    {Dropdown.component({
                        label: this.trans('tools'),
                        icon: 'fas fa-cog',
                        buttonClassName: 'Button',
                        menuClassName: "Dropdown-menu--right",
                    }, [
                        Button.component({
                            className: 'Button',
                            onclick: () => m.route.set(app.route('seo')),
                            icon: 'fas fa-heartbeat',
                        }, this.trans('health_check')),
                        Button.component({
                            className: 'Button',
                            onclick: () => m.route.set(app.route('seoSettings')),
                            icon: 'fas fa-cogs',
                        }, this.trans('seo_settings')),
                        Button.component({
                            className: 'Button',
                            onclick: () => m.route.set(app.route('seoSitemap')),
                            icon: 'fas fa-sitemap',
                        }, this.trans('sitemap_information')),
                        Button.component({
                            className: 'Button',
                            onclick: () => m.route.set(app.route('seoSearchEngines')),
                            icon: 'fas fa-search',
                        }, this.trans('search_engine_information')),
                        Button.component({
                            className: 'Button',
                            onclick: () => m.route.set(app.route('seoSSL')),
                            icon: 'fas fa-shield-alt',
                        }, this.trans('set_up_ssl'))
                    ])}
                </div>

                <h2>{this.trans('title')}</h2>

                <div className="clear"/>
            </div>
        )
    }
}
