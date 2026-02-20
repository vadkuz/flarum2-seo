import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import Switch from "flarum/common/components/Switch";
import saveSettings from "flarum/admin/utils/saveSettings";

export default class CrawlPostModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.value =
      typeof app.data.settings.seo_post_crawler === "undefined"
        ? false
        : app.data.settings.seo_post_crawler;
    this.startValue = this.value;
    this.closeText = this.trans("close");
    this.loading = false;

    if (typeof app.data.settings.seo_reviewed_post_crawler === "undefined") {
      this.saveReviewedPostCrawler();
    }
  }

  trans(key) {
    return app.translator.trans(`vadkuz-flarum2-seo.admin.modals.crawl_post.${key}`);
  }

  title() {
    return this.trans("title");
  }

  className() {
    return "Modal--small";
  }

  content() {
    return (
      <div>
        <div className="Modal-body">
          <div className="Form">
            <b>{this.trans("intro_title")}</b> {this.trans("intro_text")}

            <div style="padding: 10px 0;">
              <b style="display: block; padding-bottom: 10px;">
                <span style="display: inline-block; width: 25px;">
                  <i className="fas fa-check"></i>
                </span>
                {this.trans("option_default_title")}
              </b>
              {this.trans("option_default_body")}
            </div>

            <div style="padding: 10px 0;">
              <b style="display: block; padding-bottom: 10px;">
                <span style="display: inline-block; width: 25px;">
                  <i className="fas fa-check-double"></i>
                </span>
                {this.trans("option_all_posts_title")}
              </b>
              {this.trans("option_all_posts_body_before")}{" "}
              <a
                href="https://discuss.flarum.org/d/21894-friendsofflarum-best-answer"
                target="_blank"
              >
                {this.trans("option_all_posts_best_answer_link")}
              </a>{" "}
              {this.trans("option_all_posts_body_after")}
            </div>
          </div>
        </div>
        <div style="padding: 25px 30px; text-align: center;">
          <b style="display: block; padding-bottom: 10px;">
            {this.trans("confirm_title")}
          </b>

          <div style="display: inline-block;">
            {Switch.component(
              {
                state: this.value == "1",
                onchange: (value) => this.change(value),
              },
              this.trans("toggle_label")
            )}
          </div>
        </div>
        <div style="padding: 25px 30px; text-align: center;">
          {this.closeDialogButton()}
        </div>
      </div>
    );
  }

  change(value) {
    this.value = value;
    this.closeText =
      this.value !== this.startValue ? this.trans("save_changes") : this.trans("close");
  }

  closeDialogButton() {
    return (
      <Button type="submit" className="Button Button--primary" loading={this.loading}>
        {this.closeText}
      </Button>
    );
  }

  onsubmit() {
    if (this.value === this.startValue) {
      this.hide();
      return;
    }

    this.loading = true;

    const data = {};
    data.seo_post_crawler = this.value;

    saveSettings(data).then(this.onsaved.bind(this));
  }

  saveReviewedPostCrawler() {
    this.loading = true;

    const data = {};
    data.seo_reviewed_post_crawler = true;

    saveSettings(data).then(() => {
      this.loading = false;
      m.redraw();
    });
  }

  onsaved() {
    this.hide();
  }
}
