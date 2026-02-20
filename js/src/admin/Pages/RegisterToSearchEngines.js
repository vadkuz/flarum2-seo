import Page from "flarum/common/components/Page";
import Button from "flarum/common/components/Button";
import saveSettings from "flarum/admin/utils/saveSettings";

export default class RegisterToSearchEngines extends Page {
  oninit(vnode) {
    super.oninit(vnode);

    this.saving = false;
    this.hasConfirmed = app.data.settings.seo_reviewed_search_engines === "1";
  }

  trans(key) {
    return app.translator.trans(
      `vadkuz-flarum2-seo.admin.search_engines.${key}`
    );
  }

  view() {
    return (
      <div>
        <h2>{this.trans("title")}</h2>
        <p>{this.trans("intro_1")}</p>

        <p>
          {this.trans("intro_2_before")}{" "}
          <a href="#/seo/sitemap">{this.trans("intro_2_link")}</a>
          .
        </p>

        <div>
          <h4>{this.trans("google_title")}</h4>
          <p>
            {this.trans("google_body_1_before")}{" "}
            <a href="https://search.google.com/search-console" target="_blank">
              {this.trans("google_link")}{" "}
              <i className="fas fa-external-link-alt"></i>
            </a>
            . {this.trans("google_body_1_after")}
          </p>

          <p>{this.trans("google_body_2")}</p>
          <p>{this.trans("google_body_3")}</p>
        </div>

        <div>
          <h4>{this.trans("bing_title")}</h4>
          <p>
            {this.trans("bing_body_1_before")}{" "}
            <a href="https://www.bing.com/toolbox/webmaster" target="_blank">
              {this.trans("bing_link")}{" "}
              <i className="fas fa-external-link-alt"></i>
            </a>{" "}
            {this.trans("bing_body_1_after")}
          </p>
          <p>{this.trans("bing_body_2")}</p>
        </div>

        <div>
          <h4>{this.trans("yandex_title")}</h4>
          <p>
            {this.trans("yandex_body_1_before")}{" "}
            <a href="https://webmaster.yandex.com" target="_blank">
              {this.trans("yandex_link")}{" "}
              <i className="fas fa-external-link-alt"></i>
            </a>{" "}
            {this.trans("yandex_body_1_after")}
          </p>
          <p>{this.trans("yandex_body_2")}</p>
        </div>

        <div>
          <h4>{this.trans("yahoo_title")}</h4>
          <p>{this.trans("yahoo_body")}</p>
        </div>

        <div className="clear"></div>
        {Button.component(
          {
            className: "Button pull-right " + (this.hasConfirmed ? "hidden" : ""),
            onclick: () => this.confirm(),
            icon: "fas fa-check",
            loading: this.saving,
          },
          this.trans("confirm_button")
        )}
      </div>
    );
  }

  confirm() {
    this.saveSingleSetting("seo_reviewed_search_engines", true);
  }

  saveSingleSetting(setting, value) {
    if (this.saving) return;

    this.saving = true;

    const data = {};
    data[setting] = value;

    saveSettings(data)
      .then(() => {
        this.hasConfirmed = true;
        app.alerts.show(
          { type: "success" },
          app.translator.trans("core.admin.settings.saved_message")
        );
      })
      .catch(() => {})
      .then(() => {
        this.saving = false;
        m.redraw();
      });
  }
}
