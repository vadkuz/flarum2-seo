import Page from "flarum/common/components/Page";

export default class Sitemap extends Page {
  trans(key) {
    return app.translator.trans(`vadkuz-flarum2-seo.admin.sitemap.${key}`);
  }

  view() {
    return (
      <div>
        <h2>{this.trans("title")}</h2>
        <p>{this.trans("intro_1")}</p>
        <p>{this.trans("intro_2")}</p>

        <h4>{this.trans("extension_title")}</h4>
        <p>
          {this.trans("extension_body_before")}{" "}
          <a href="https://discuss.flarum.org/d/14941-fof-sitemap" target="_blank">
            {this.trans("extension_link")}{" "}
            <i className="fas fa-external-link-alt"></i>
          </a>{" "}
          {this.trans("extension_body_after")}
        </p>

        <p>{this.trans("coverage_body")}</p>

        <h4>{this.trans("installed_title")}</h4>
        <p>{this.trans("installed_body")}</p>
      </div>
    );
  }
}
