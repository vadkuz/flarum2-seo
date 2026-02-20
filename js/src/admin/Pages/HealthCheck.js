import Page from "flarum/common/components/Page";
import Button from "flarum/common/components/Button";
import saveSettings from "flarum/admin/utils/saveSettings";

export default class HealthCheck extends Page {
  oninit(vnode) {
    super.oninit(vnode);

    this.settings = app.data.settings;
    this.saving = false;
  }

  trans(key, params = {}) {
    return app.translator.trans(`vadkuz-flarum2-seo.admin.health.${key}`, params);
  }

  view() {
    return (
      <div>
        <p className="seo-intro">
          {this.trans("intro_1_before")}{" "}
          <a href="https://discuss.flarum.org/d/18316-flarum-seo" target="_blank">
            {this.trans("intro_1_forum_link")} <i className="fas fa-external-link-alt" />
          </a>
          {this.trans("intro_1_between")}{" "}
          <a href="https://github.com/vadkuz/flarum2-seo/issues" target="_blank">
            {this.trans("intro_1_issue_link")} <i className="fas fa-external-link-alt" />
          </a>
          .
        </p>

        <p className="seo-intro">
          {this.trans("intro_2_before")}{" "}
          <a href="https://github.com/vadkuz/flarum2-seo" target="_blank">
            {this.trans("intro_2_github_link")} <i className="fas fa-external-link-alt" />
          </a>
          . {this.trans("intro_2_between")}{" "}
          <a href="https://github.com/vadkuz/flarum2-seo" target="_blank">
            {this.trans("intro_2_docs_link")} <i className="fas fa-external-link-alt" />
          </a>
          .
        </p>

        <p className="seo-intro">{this.trans("intro_3")}</p>

        <table className="seo-check-table">
          <thead>
            <tr>
              <td>{this.trans("table.technique")}</td>
              <td width="150">{this.trans("table.status")}</td>
            </tr>
          </thead>
          <tbody>
            {this.forumDescription()}
            {this.forumKeywords()}
            {this.siteUsesSSL()}
            {this.discussionPostSet()}
            {this.socialMediaImage()}
            {this.hasSitemap()}
            {this.registeredSearchEngines()}
            {this.robotsTxt()}
            {this.tagsAvailable()}
            {this.reviewAgain()}
          </tbody>
        </table>
      </div>
    );
  }

  forumDescription() {
    let passed =
      typeof this.settings.forum_description !== "undefined" &&
      this.settings.forum_description !== ""
        ? true
        : "must";
    let reason = this.trans("checks.forum_description.reason_missing");

    if (passed === true && this.settings.forum_description.length <= 20) {
      passed = false;
      reason = this.trans("checks.forum_description.reason_short");
    }

    if (
      passed === true &&
      this.settings.forum_description.indexOf("This is beta software") >= 0
    ) {
      passed = "must";
      reason = this.trans("checks.forum_description.reason_default");
    }

    return (
      <tr>
        <td>
          {this.trans("checks.forum_description.title")}
          {this.notPassedError(
            passed,
            reason,
            this.trans("actions.update_description"),
            this.getSettingUrl("description")
          )}
        </td>
        {this.passed(passed)}
      </tr>
    );
  }

  forumKeywords() {
    const passed =
      typeof this.settings.forum_keywords !== "undefined" &&
      this.settings.forum_keywords !== "";
    const reason = this.trans("checks.forum_keywords.reason_missing");

    return (
      <tr>
        <td>
          {this.trans("checks.forum_keywords.title")}
          {this.notPassedError(
            passed,
            reason,
            this.trans("actions.update_keywords"),
            this.getSettingUrl("keywords")
          )}
        </td>
        {this.passed(passed)}
      </tr>
    );
  }

  siteUsesSSL() {
    const passed =
      app.forum.attribute("baseUrl").indexOf("https://") >= 0 ? true : "must";

    return (
      <tr>
        <td>
          {this.trans("checks.ssl.title")}
          {this.notPassedError(
            passed,
            this.trans("checks.ssl.reason_missing"),
            this.trans("actions.setup_ssl"),
            app.route("extension", {
              id: "vadkuz-flarum2-seo",
              page: "ssl",
            })
          )}
        </td>
        {this.passed(passed)}
      </tr>
    );
  }

  discussionPostSet() {
    const passed = typeof this.settings.seo_reviewed_post_crawler !== "undefined";

    return (
      <tr>
        <td>
          {this.trans("checks.discussion_posts.title")}
          {this.notPassedError(
            passed,
            this.trans("checks.discussion_posts.reason_missing"),
            this.trans("actions.review_post_settings"),
            this.getSettingUrl("discussion-post")
          )}
        </td>
        {this.passed(passed)}
      </tr>
    );
  }

  socialMediaImage() {
    let passed = true;

    if (
      typeof this.settings.seo_social_media_image_path === "undefined" ||
      this.settings.seo_social_media_image_path === null
    ) {
      passed = false;
    }

    return (
      <tr>
        <td>
          {this.trans("checks.social_image.title")}
          {this.notPassedError(
            passed,
            this.trans("checks.social_image.reason_missing"),
            this.trans("actions.update_image"),
            this.getSettingUrl("social-media")
          )}
        </td>
        {this.passed(passed)}
      </tr>
    );
  }

  hasSitemap() {
    let passed = true;

    if (
      app.data.settings.extensions_enabled.indexOf("flagrow-sitemap") === -1 &&
      app.data.settings.extensions_enabled.indexOf("fof-sitemap") === -1
    ) {
      passed = false;
    }

    return (
      <tr>
        <td>
          {this.trans("checks.sitemap.title")}
          {this.notPassedError(
            passed,
            this.trans("checks.sitemap.reason_missing"),
            this.trans("actions.read_sitemap"),
            app.route("extension", {
              id: "vadkuz-flarum2-seo",
              page: "sitemap",
            })
          )}
        </td>
        {this.passed(passed)}
      </tr>
    );
  }

  robotsTxt() {
    return (
      <tr>
        <td>
          {this.trans("checks.robots.title_before")}{" "}
          <a
            href={app.forum.attribute("baseUrl") + "/robots.txt"}
            target="_blank"
            className="robots-link"
          >
            {this.trans("checks.robots.open_link")}{" "}
            <i className="fas fa-external-link-alt"></i>
          </a>
        </td>
        {this.passed(true)}
      </tr>
    );
  }

  tagsAvailable() {
    return (
      <tr>
        <td>{this.trans("checks.meta_tags.title")}</td>
        {this.passed(true)}
      </tr>
    );
  }

  registeredSearchEngines() {
    const passed = typeof this.settings.seo_reviewed_search_engines !== "undefined";

    return (
      <tr>
        <td>
          {this.trans("checks.search_engines.title")}
          {this.notPassedError(
            passed,
            this.trans("checks.search_engines.reason_missing"),
            this.trans("actions.more_info"),
            app.route("extension", {
              id: "vadkuz-flarum2-seo",
              page: "search-engines",
            })
          )}
        </td>
        {this.passed(passed)}
      </tr>
    );
  }

  reviewAgain() {
    let passed = true;
    let nextReviewDate = new Date();

    if (typeof app.data.settings.seo_review_settings === "undefined") {
      passed = false;
    } else {
      nextReviewDate = new Date(app.data.settings.seo_review_settings * 1000);
    }

    if (passed && Math.floor(Date.now() / 1000) > app.data.settings.seo_review_settings) {
      passed = false;
    }

    return (
      <tr>
        <td>
          {this.trans("checks.review_again.title", {
            date: nextReviewDate.toDateString(),
          })}
          {this.notPassedError(
            passed,
            this.trans("checks.review_again.reason_missing"),
            this.trans("actions.reviewed"),
            () => {
              const now = new Date();
              const nextDate = Math.floor(
                new Date(now.getFullYear(), now.getMonth() + 2, 1) / 1000
              );

              this.saveSingleSetting("seo_review_settings", nextDate);
            }
          )}
        </td>
        {this.passed(passed)}
      </tr>
    );
  }

  getSettingUrl(setting = "") {
    if (setting === "") {
      return app.route("extension", {
        id: "vadkuz-flarum2-seo",
      });
    }

    return app.route("extension", {
      id: "vadkuz-flarum2-seo",
      page: "settings",
      setting: setting,
    });
  }

  passed(passed) {
    if (passed === "must" || !passed) {
      return (
        <td className={passed === "must" ? "row-must" : "row-warning"}>
          <i class="fas fa-exclamation-circle" /> {this.trans("status.warning")}
        </td>
      );
    }

    return (
      <td className="row-passed">
        <i class="fas fa-check" /> {this.trans("status.all_set")}
      </td>
    );
  }

  notPassedError(passed, reason, buttonText = null, url = app.route("seoSettings")) {
    if (passed === true) return;

    return (
      <div className="row-not-passed-error">
        {reason}

        <div className="button-container">
          {Button.component(
            {
              className: "Button",
              onclick: () => {
                if (typeof url === "string") {
                  m.route.set(url);
                } else {
                  url();
                }
              },
            },
            buttonText || this.trans("actions.update_setting")
          )}
        </div>
      </div>
    );
  }

  saveSingleSetting(setting, value) {
    if (this.saving) return;

    this.saving = true;

    const data = {};
    data[setting] = value;

    saveSettings(data)
      .then(() => {
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
