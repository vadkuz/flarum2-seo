import Component from "flarum/common/Component";
import FieldSet from "flarum/common/components/FieldSet";
import Button from "flarum/common/components/Button";
import saveSettings from "flarum/admin/utils/saveSettings";
import Switch from "flarum/common/components/Switch";
import UploadImageButton from "flarum/common/components/UploadImageButton";
import CrawlPostModal from "../Modals/CrawlPostModal";
import RobotsModal from "../Modals/RobotsModal";
import countKeywords from "../../utils/countKeywords";
import Stream from "flarum/common/utils/Stream";
import DoFollowListModal from "../Modals/DoFollowListModal";
import Select from "flarum/common/components/Select";
import ItemList from "flarum/common/utils/ItemList";

export default class SeoSettings extends Component {
  oninit(vnode) {
    super.oninit(vnode);

    this.saving = false;
    this.fields = [
      "forum_title",
      "forum_description",
      "forum_keywords",
      "seo_allow_all_bots",
      "seo_twitter_card_size",
    ];
    this.values = {};

    const settings = app.data.settings;
    this.fields.forEach((key) => (this.values[key] = Stream(settings[key] || "")));

    this.allowBotsValue = settings.seo_allow_all_bots !== "0";

    app.forum.data.attributes.seo_social_media_imageUrl =
      app.data.settings.seo_social_media_image_url;

    this.showField = "all";

    if (m.route.param("setting") !== undefined) {
      this.showField = m.route.param("setting");
    }
  }

  trans(key, params = {}) {
    return app.translator.trans(`vadkuz-flarum2-seo.admin.settings.${key}`, params);
  }

  view() {
    return (
      <div>
        {this.infoText()}

        <form onsubmit={this.onsubmit.bind(this)} className="BasicsPage">
          {this.viewItems().toArray()}
        </form>
      </div>
    );
  }

  viewItems() {
    const items = new ItemList();

    items.add(
      "description",
      FieldSet.component(
        {
          label: app.translator.trans("core.admin.basics.forum_description_heading"),
          className:
            this.showField !== "all" && this.showField !== "description"
              ? "hidden"
              : "",
        },
        [
          <div className="helpText">
            {app.translator.trans("core.admin.basics.forum_description_text")}
          </div>,
          <textarea className="FormControl" bidi={this.values.forum_description} />,
          this.showField === "description" &&
            Button.component(
              {
                type: "submit",
                className: "Button Button--primary",
                loading: this.saving,
                disabled: !this.changed(),
              },
              app.translator.trans("core.admin.settings.submit_button")
            ),
        ]
      ),
      100
    );

    items.add(
      "keywords",
      FieldSet.component(
        {
          label: this.trans("forum_keywords_label"),
          className:
            this.showField !== "all" && this.showField !== "keywords"
              ? "hidden"
              : "",
        },
        [
          <div className="helpText">{this.trans("forum_keywords_help")}</div>,
          <textarea
            className="FormControl"
            bidi={this.values.forum_keywords}
            placeholder={this.trans("forum_keywords_placeholder")}
          />,
          <div
            className="helpText"
            style={{
              color:
                countKeywords(this.values.forum_keywords()) == false ? "red" : null,
            }}
          >
            <b>{this.trans("forum_keywords_note")}</b>{" "}
            {this.trans("forum_keywords_example_prefix")}{" "}
            <i>{this.trans("forum_keywords_example_values")}</i>
          </div>,
          this.showField === "keywords" &&
            Button.component(
              {
                type: "submit",
                className: "Button Button--primary",
                loading: this.saving,
                disabled: !this.changed(),
              },
              app.translator.trans("core.admin.settings.submit_button")
            ),
        ]
      ),
      90
    );

    items.add(
      "twitterCardSize",
      FieldSet.component(
        {
          label: this.trans("twitter_card_size_label"),
          className: this.showField !== "all" ? "hidden" : "",
        },
        [
          <div className="helpText">{this.trans("twitter_card_size_help")}</div>,
          Select.component({
            options: {
              large: this.trans("twitter_card_size_option_large"),
              summary: this.trans("twitter_card_size_option_summary"),
            },
            value: this.values.seo_twitter_card_size() || "large",
            onchange: (val) => {
              this.values.seo_twitter_card_size(val);
              this.hasChanges = true;
            },
          }),
          Button.component(
            {
              type: "submit",
              className: "Button Button--primary",
              loading: this.saving,
              disabled: !this.changed(),
            },
            app.translator.trans("core.admin.settings.submit_button")
          ),
        ]
      ),
      70
    );

    items.add(
      "socialMediaImage",
      FieldSet.component(
        {
          label: this.trans("social_media_image_label"),
          className:
            "social-media-uploader " +
            (this.showField !== "all" && this.showField !== "social-media"
              ? "hidden"
              : ""),
        },
        [
          <div className="helpText">{this.trans("social_media_image_help")}</div>,
          UploadImageButton.component({
            name: "seo_social_media_image",
          }),
        ]
      ),
      60
    );

    items.add(
      "crawlSettings",
      FieldSet.component(
        {
          label: this.trans("discussion_post_crawl_label"),
          className:
            this.showField !== "all" && this.showField !== "discussion-post"
              ? "hidden"
              : "",
        },
        [
          <div className="helpText">{this.trans("discussion_post_crawl_help")}</div>,
          Button.component(
            {
              className: "Button",
              onclick: () => app.modal.show(CrawlPostModal),
            },
            this.trans("discussion_post_crawl_action")
          ),
        ]
      ),
      50
    );

    items.add(
      "noFollowLink",
      FieldSet.component(
        {
          label: this.trans("nofollow_links_label"),
          className: this.showField !== "all" ? "hidden" : "",
        },
        [
          <div className="helpText">{this.trans("nofollow_links_help_1")}</div>,
          <div className="helpText">
            {this.trans("nofollow_links_help_2_before")}{" "}
            <a href={"https://github.com/vadkuz/flarum2-seo"} target={"_blank"}>
              {this.trans("learn_more")}
            </a>
            .
          </div>,
          <div style="height: 5px;"></div>,
          <div>
            {Button.component(
              {
                className: "Button",
                loading: this.saving,
                onclick: () => app.modal.show(DoFollowListModal),
              },
              this.trans("nofollow_links_action")
            )}
          </div>,
        ]
      ),
      40
    );

    items.add(
      "linkTarget",
      FieldSet.component(
        {
          label: this.trans("open_external_in_new_tab_label"),
          className: this.showField !== "all" ? "hidden" : "",
        },
        [<div className="helpText">{this.trans("open_external_in_new_tab_help")}</div>]
      ),
      30
    );

    items.add(
      "robots",
      FieldSet.component(
        {
          label: this.trans("robots_label"),
          className:
            this.showField !== "all" && this.showField !== "robots"
              ? "hidden"
              : "",
        },
        [
          <div className="helpText">
            {this.trans("robots_help_before")}{" "}
            <a href="https://discuss.flarum.org/d/14941-fof-sitemap" target="_blank">
              {this.trans("robots_help_sitemap_link")}
            </a>{" "}
            {this.trans("robots_help_after")}
          </div>,
          <div style="height: 5px;"></div>,
          Switch.component(
            {
              state: this.allowBotsValue,
              onchange: (value) => this.saveAllowBots(value),
            },
            this.trans("robots_allow_all_bots")
          ),
          <div style="height: 5px;"></div>,
          <div>
            {Button.component(
              {
                className: "Button",
                loading: this.saving,
                onclick: () => app.modal.show(RobotsModal),
              },
              this.trans("robots_edit_action")
            )}{" "}
            <a
              href={app.forum.attribute("baseUrl") + "/robots.txt"}
              target="_blank"
              className="robots-link"
            >
              {this.trans("robots_open_link")}{" "}
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>,
        ]
      ),
      20
    );

    items.add(
      "updated",
      FieldSet.component(
        {
          label: this.trans("updated_setting_label"),
          className: this.showField === "all" ? "hidden" : "",
        },
        [
          <div className="helpText">{this.trans("updated_setting_help")}</div>,
          Button.component(
            {
              className: "Button",
              icon: "fas fa-sync",
              loading: this.saving,
              onclick: () =>
                m.route.set(
                  app.route("extension", {
                    id: "vadkuz-flarum2-seo",
                  })
                ),
            },
            this.trans("updated_setting_action")
          ),
        ]
      ),
      10
    );

    return items;
  }

  infoText() {
    if (this.showField !== "all") {
      return;
    }

    return (
      <div>
        <p>{this.trans("info_1")}</p>
        <p>{this.trans("info_2")}</p>
      </div>
    );
  }

  changed() {
    return this.fields.some((key) => this.values[key]() !== app.data.settings[key]);
  }

  onsubmit(e) {
    e.preventDefault();

    if (this.saving) return;

    this.saving = true;
    app.alerts.dismiss(this.successAlert);

    const settings = {};
    this.fields.forEach((key) => (settings[key] = this.values[key]()));

    if (settings.seo_twitter_card_size === "") {
      settings.seo_twitter_card_size = "large";
    }

    saveSettings(settings)
      .then(() =>
        app.alerts.show(
          { type: "success" },
          app.translator.trans("core.admin.settings.saved_message")
        )
      )
      .catch(() => {})
      .then(() => {
        this.saving = false;
        m.redraw();
      });
  }

  saveAllowBots(value) {
    if (this.saving) return;

    this.saving = true;
    this.allowBotsValue = value;

    const data = {};
    data.seo_allow_all_bots = value;

    saveSettings(data)
      .then(() =>
        app.alerts.show(
          { type: "success" },
          app.translator.trans("core.admin.settings.saved_message")
        )
      )
      .catch(() => {})
      .then(() => {
        this.saving = false;
        m.redraw();
      });
  }
}
