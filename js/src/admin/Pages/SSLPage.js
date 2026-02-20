import Page from "flarum/common/components/Page";

export default class SSLPage extends Page {
  trans(key) {
    return app.translator.trans(`vadkuz-flarum2-seo.admin.ssl.${key}`);
  }

  view() {
    return (
      <div>
        <h2>{this.trans("title")}</h2>
        <p>{this.trans("intro")}</p>

        <h4>
          {this.trans("search_engines_title")} <i className="fas fa-heart"></i>
        </h4>
        <p>{this.trans("search_engines_body_1")}</p>
        <p>{this.trans("search_engines_body_2")}</p>

        <h4>{this.trans("what_is_title")}</h4>
        <p>{this.trans("what_is_body")}</p>

        <h4>{this.trans("how_to_add_title")}</h4>
        <p>
          {this.trans("how_to_add_body_before")}{" "}
          <a href="https://letsencrypt.org/" target="_blank">
            {this.trans("lets_encrypt_link")}{" "}
            <i className="fas fa-external-link-alt"></i>
          </a>
          .
        </p>

        <h4>{this.trans("done_title")}</h4>
        <p>{this.trans("done_body")}</p>

        <h4>{this.trans("without_ssl_title")}</h4>
        <p>{this.trans("without_ssl_body")}</p>
      </div>
    );
  }
}
