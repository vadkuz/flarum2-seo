import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import Switch from "flarum/common/components/Switch";
import Stream from "flarum/common/utils/Stream";
import Alert from "flarum/common/components/Alert";
import LoadingIndicator from "flarum/common/components/LoadingIndicator";
import countKeywords from "../../admin/utils/countKeywords";
import clsx from "clsx";

export default class MetaSeoModal extends Modal {
  initialized = true;
  initialLoading = false;

  trans(key, params = {}) {
    return app.translator.trans(`vadkuz-flarum2-seo.forum.meta_modal.${key}`, params);
  }

  oninit(vnode) {
    super.oninit(vnode);

    // Open dialog
    if (this.attrs.object) {
      // Get SeoMeta relationship
      if (!this.attrs.object.seoMeta) {
        this.initialized = false;

        app.alerts.show(
          Alert,
          {
            type: "error",
            title: this.trans("alerts.unsupported_object_title"),
            controls: [
              <a
                class="Button Button--link"
                href="https://github.com/vadkuz/flarum2-seo"
                target={"_blank"}
              >
                {this.trans("alerts.documentation_button")}
              </a>,
            ],
          },
          this.trans("alerts.unsupported_object_body")
        );

        setTimeout(() => {
          this.hide();
        }, 100);
        return;
      }

      this.meta = this.attrs.object.seoMeta();
    } else {
      this.initializeLoad();
    }

    this.hasChanges = false;
    this.closeText = this.trans("buttons.close");
    this.closeInfoText = null;
    this.loading = false;

    this.enableCustomTwitter = false;
    this.enableCustomOpenGraph = false;
    this.wasManaged = true;
    this.seoTagsOpened = false;

    // Define options
    this.initializeData();
  }

  initializeData() {
    if (!this.meta) return;

    this.autoUpdateData = Stream(this.meta.autoUpdateData());
    this.wasManaged = this.meta.autoUpdateData() === true;

    this.metaTitle = Stream(this.meta.title());
    this.description = Stream(this.meta.description());
    this.keywords = Stream(this.meta.keywords());
    this.robotsNoindex = Stream(this.meta.robotsNoindex());
    this.robotsNofollow = Stream(this.meta.robotsNofollow());
    this.robotsNoarchive = Stream(this.meta.robotsNoarchive());
    this.robotsNoimageindex = Stream(this.meta.robotsNoimageindex());
    this.robotsNosnippet = Stream(this.meta.robotsNosnippet());
    this.twitterTitle = Stream(this.meta.twitterTitle());
    this.twitterDescription = Stream(this.meta.twitterDescription());
    this.twitterImage = Stream(this.meta.twitterImage());
    this.twitterImageSource = Stream(this.meta.twitterImageSource());
    this.openGraphTitle = Stream(this.meta.openGraphTitle());
    this.openGraphDescription = Stream(this.meta.openGraphDescription());
    this.openGraphImage = Stream(this.meta.openGraphImage());
    this.openGraphImageSource = Stream(this.meta.openGraphImageSource());
    this.estimatedReadingTime = Stream(this.meta.estimatedReadingTime());
    this.createdAt = Stream(this.meta.createdAt());
    this.updatedAt = Stream(this.meta.updatedAt());

    this.enableCustomTwitter =
      this.twitterTitle() !== null ||
      this.twitterDescription() !== null ||
      this.twitterImageSource() !== "auto";

    this.enableCustomOpenGraph =
      this.openGraphTitle() !== null || this.openGraphDescription() !== null;
  }

  title() {
    return this.trans("title");
  }

  className() {
    return "Modal Modal-SEO-settings";
  }

  initializeLoad() {
    this.initialLoading = true;

    app.store
      .find("seo_meta", `${this.attrs.objectType}-${this.attrs.objectId}`)
      .then((data) => {
        this.isLoading = false;
        this.meta = data;
        this.initialLoading = false;

        this.initializeData();
      })
      .then(() => {
        m.redraw();
      });
  }

  content() {
    // Hide due to invalid relationship or loading data
    if (!this.initialized || this.initialLoading) {
      return <div>{LoadingIndicator.component({})}</div>;
    }

    return (
      <div>
        <div className="Modal-body" onkeyup={() => this.updateHasChanges()}>
          <div className="Form">
            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>{this.trans("auto_update.title")}</div>
                <div className="helpText">{this.trans("auto_update.help")}</div>
              </div>
              <div className="SeoItemContent">
                <div className="ManagedContainer">
                  {Switch.component(
                    {
                      state: this.autoUpdateData(),
                      onchange: (value) => {
                        this.autoUpdateData(value);
                        this.updateHasChanges();
                      },
                    },
                    this.trans("auto_update.toggle")
                  )}
                </div>
              </div>
            </div>

            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>{this.trans("meta_title.title")}</div>
                <div className="helpText">{this.trans("meta_title.help")}</div>
              </div>

              <div className="SeoItemContent">
                <div className="ManagedContainer">
                  <input
                    className="FormControl"
                    bidi={this.metaTitle}
                    placeholder={this.trans("placeholders.page_title")}
                    disabled={this.autoUpdateData()}
                  />

                  {this.autoUpdateData() && (
                    <div className="ManagedText">
                      <i className="fas fa-check" /> {this.trans("managed")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>
                  {this.trans("meta_description.title")}
                </div>
                <div className="helpText">{this.trans("meta_description.help")}</div>
              </div>

              <div className="SeoItemContent">
                <div className="ManagedContainer">
                  <textarea
                    className="FormControl"
                    bidi={this.description}
                    placeholder={this.trans("placeholders.meta_description")}
                    disabled={this.autoUpdateData()}
                  />

                  {this.autoUpdateData() && (
                    <div className="ManagedText">
                      <i className="fas fa-check" /> {this.trans("managed")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>{this.trans("keywords.title")}</div>
                <div className="helpText">{this.trans("keywords.help")}</div>
              </div>

              <div className="SeoItemContent">
                <textarea
                  className="FormControl"
                  bidi={this.keywords}
                  placeholder={this.trans("placeholders.keywords")}
                />
                <div
                  className={clsx(
                    "SeoItemContent-helpertext",
                    countKeywords(this.keywords() ?? "") == false && "invalid"
                  )}
                >
                  <b>{this.trans("keywords.note")}</b> {this.trans("keywords.example_prefix")}{" "}
                  <i>{this.trans("keywords.example_values")}</i>
                </div>
              </div>
            </div>

            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>{this.trans("meta_image.title")}</div>
                <div className="helpText">{this.trans("meta_image.help")}</div>
              </div>

              <div className="SeoItemContent">
                <div className="ManagedContainer">
                  <input
                    className="FormControl"
                    bidi={this.openGraphImage}
                    placeholder={this.trans("placeholders.image_url")}
                    disabled={
                      this.autoUpdateData() &&
                      this.openGraphImageSource() === "auto"
                    }
                  />

                  {/* Show managed tag */}
                  {this.autoUpdateData() &&
                    this.openGraphImageSource() !== "custom" && (
                      <div className="ManagedText">
                        <i className="fas fa-check" /> {this.trans("managed")}
                      </div>
                    )}

                  {!this.autoUpdateData() &&
                    this.returnFoFUploadButton((fileUrl) => {
                      this.openGraphImage(fileUrl);
                      this.openGraphImageSource("fof-upload");
                    })}

                  {/* Show managed by message */}
                  {this.openGraphImageSource() !== "auto" &&
                    this.openGraphImageSource() !== "custom" && (
                      <div className="SeoItemContent-helpertext">
                        {this.trans("meta_image.managed_by", {
                          source: this.openGraphImageSource(),
                        })}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>{this.trans("robots.title")}</div>
                <div className="helpText">{this.trans("robots.help")}</div>
              </div>

              <div className="SeoItemContent">
                <div
                  class={clsx(
                    "SeoTags-dropdown-container",
                    this.seoTagsOpened && "SeoTags-dropdown-open"
                  )}
                >
                  <div
                    className="SeoTags"
                    onclick={() => (this.seoTagsOpened = !this.seoTagsOpened)}
                  >
                    {this.returnTag(
                      !this.robotsNoindex(),
                      this.trans("robots.tags.allow_indexing"),
                      this.trans("robots.tags.disallow_indexing")
                    )}
                    {this.returnTag(
                      !this.robotsNofollow(),
                      this.trans("robots.tags.allow_follow"),
                      this.trans("robots.tags.disallow_follow")
                    )}
                    {this.robotsNoarchive() &&
                      this.returnTag(
                        false,
                        "",
                        this.trans("robots.tags.disallow_archive")
                      )}
                    {this.robotsNoimageindex() &&
                      this.returnTag(
                        false,
                        "",
                        this.trans("robots.tags.disallow_image_indexing")
                      )}
                    {this.robotsNosnippet() &&
                      this.returnTag(
                        false,
                        "",
                        this.trans("robots.tags.disallow_snippets")
                      )}
                  </div>

                  <div className={"SeoTags-dropdown"}>
                    {Switch.component(
                      {
                        state: !this.robotsNoindex(),
                        onchange: (value) => {
                          this.robotsNoindex(!value);
                          this.updateHasChanges();
                        },
                      },
                      this.trans("robots.switches.allow_indexing")
                    )}
                    {Switch.component(
                      {
                        state: !this.robotsNofollow(),
                        onchange: (value) => {
                          this.robotsNofollow(!value);
                          this.updateHasChanges();
                        },
                      },
                      this.trans("robots.switches.allow_follow")
                    )}
                    {Switch.component(
                      {
                        state: this.robotsNoarchive(),
                        onchange: (value) => {
                          this.robotsNoarchive(value);
                          this.updateHasChanges();
                        },
                      },
                      this.trans("robots.switches.noarchive")
                    )}
                    {Switch.component(
                      {
                        state: this.robotsNoimageindex(),
                        onchange: (value) => {
                          this.robotsNoimageindex(value);
                          this.updateHasChanges();
                        },
                      },
                      this.trans("robots.switches.noimageindex")
                    )}
                    {Switch.component(
                      {
                        state: this.robotsNosnippet(),
                        onchange: (value) => {
                          this.robotsNosnippet(value);
                          this.updateHasChanges();
                        },
                      },
                      this.trans("robots.switches.nosnippet")
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>{this.trans("reading_time.title")}</div>
                <div className="helpText">{this.trans("reading_time.help")}</div>
              </div>

              <div className="SeoItemContent">
                <div className="ManagedContainer">
                  <input
                    className="FormControl"
                    bidi={this.estimatedReadingTime}
                    placeholder={this.trans("placeholders.reading_time_seconds")}
                    type="number"
                    disabled={this.autoUpdateData()}
                  />

                  {this.autoUpdateData() && (
                    <div className="ManagedText">
                      <i className="fas fa-check" /> {this.trans("managed")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>{this.trans("twitter_card.title")}</div>
              </div>

              <div className="SeoItemContent">
                <div className="ManagedContainer">
                  {Switch.component(
                    {
                      state: !this.enableCustomTwitter,
                      onchange: (value) => {
                        this.enableCustomTwitter = !value;
                        this.updateHasChanges();
                      },
                      disabled: this.autoUpdateData(),
                    },
                    this.trans("twitter_card.auto_generate")
                  )}

                  {this.autoUpdateData() && (
                    <div className="ManagedText">
                      <i className="fas fa-check" /> {this.trans("managed")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {this.enableCustomTwitter && (
              <div className="SeoItemContainer">
                <div className="SeoItemInfo">
                  <div class={"SeoItemInfo-title"}>
                    {this.trans("twitter_card.twitter_title")}
                  </div>
                </div>

                <div className="SeoItemContent">
                  <div className="ManagedContainer">
                    <input
                      className="FormControl"
                      bidi={this.twitterTitle}
                      placeholder={this.metaTitle()}
                      disabled={this.autoUpdateData()}
                    />
                  </div>
                </div>
              </div>
            )}

            {this.enableCustomTwitter && (
              <div className="SeoItemContainer">
                <div className="SeoItemInfo">
                  <div class={"SeoItemInfo-title"}>
                    {this.trans("twitter_card.twitter_description")}
                  </div>
                </div>

                <div className="SeoItemContent">
                  <div className="ManagedContainer">
                    <textarea
                      className="FormControl"
                      bidi={this.twitterDescription}
                      placeholder={this.description()}
                      disabled={this.autoUpdateData()}
                    />
                  </div>
                </div>
              </div>
            )}

            {this.enableCustomTwitter && (
              <div className="SeoItemContainer">
                <div className="SeoItemInfo">
                  <div class={"SeoItemInfo-title"}>
                    {this.trans("twitter_card.twitter_image")}
                  </div>
                  <div className="helpText">{this.trans("twitter_card.image_help")}</div>
                </div>

                <div className="SeoItemContent">
                  <div className="ManagedContainer">
                    <input
                      className="FormControl"
                      bidi={this.twitterImage}
                      placeholder={
                        this.openGraphImage() ?? this.trans("placeholders.image_url")
                      }
                      disabled={
                        this.autoUpdateData() && this.twitterImage() === "auto"
                      }
                    />

                    {this.returnFoFUploadButton((fileUrl) => {
                      this.twitterImage(fileUrl);
                      this.twitterImageSource("fof-upload");
                    })}

                    {this.twitterImageSource() !== "auto" &&
                      this.twitterImageSource() !== "custom" && (
                        <div className="SeoItemContent-helpertext">
                          {this.trans("twitter_card.managed_by", {
                            source: this.twitterImageSource(),
                          })}{" "}
                          <a
                            href="#"
                            onclick={(e) => {
                              e.preventDefault();

                              this.twitterImage(null);
                              this.twitterImageSource("auto");
                              this.updateHasChanges();
                            }}
                          >
                            {this.trans("actions.reset_image")}
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            <div className="SeoItemContainer">
              <div className="SeoItemInfo">
                <div class={"SeoItemInfo-title"}>{this.trans("open_graph.title")}</div>
              </div>

              <div className="SeoItemContent">
                <div className="ManagedContainer">
                  {Switch.component(
                    {
                      state: !this.enableCustomOpenGraph,
                      onchange: (value) => {
                        this.enableCustomOpenGraph = !value;
                        this.updateHasChanges();
                      },
                      disabled: this.autoUpdateData(),
                    },
                    this.trans("open_graph.auto_generate")
                  )}

                  {this.autoUpdateData() && (
                    <div className="ManagedText">
                      <i className="fas fa-check" /> {this.trans("managed")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {this.enableCustomOpenGraph && (
              <div className="SeoItemContainer">
                <div className="SeoItemInfo">
                  <div class={"SeoItemInfo-title"}>
                    {this.trans("open_graph.open_graph_title")}
                  </div>
                </div>

                <div className="SeoItemContent">
                  <div className="ManagedContainer">
                    <input
                      className="FormControl"
                      bidi={this.openGraphTitle}
                      placeholder={this.metaTitle()}
                      disabled={this.autoUpdateData()}
                    />
                  </div>
                </div>
              </div>
            )}

            {this.enableCustomOpenGraph && (
              <div className="SeoItemContainer">
                <div className="SeoItemInfo">
                  <div class={"SeoItemInfo-title"}>
                    {this.trans("open_graph.open_graph_description")}
                  </div>
                </div>

                <div className="SeoItemContent">
                  <div className="ManagedContainer">
                    <textarea
                      className="FormControl"
                      bidi={this.openGraphDescription}
                      placeholder={this.trans("placeholders.custom_twitter_description")}
                      disabled={this.autoUpdateData()}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style="padding: 25px 30px; text-align: center;">
          {this.closeInfoText && (
            <div style="margin-bottom: 15px; font-size: 12px;">
              <b>{this.trans("notices.note_label")}</b> {this.closeInfoText}
            </div>
          )}
          {this.closeDialogButton()}
        </div>
      </div>
    );
  }

  returnFoFUploadButton(onSelect) {
    let fofUploadButton = null;

    const fofUpload = flarum.extensions?.["fof-upload"];
    const Uploader = fofUpload?.components?.Uploader;
    const FileManagerModal = fofUpload?.components?.FileManagerModal;

    if (
      "fof-upload" in flarum.extensions &&
      app.forum.attribute("fof-upload.canUpload") &&
      Uploader &&
      FileManagerModal
    ) {
      const uploader = new Uploader();

      fofUploadButton = (
        <Button
          class="UploadButton Button"
          onclick={async () => {
            app.modal.show(
              FileManagerModal,
              {
                uploader: uploader,
                onSelect: (files) => {
                  const file = app.store.getById("files", files[0]);

                  onSelect(file.url());
                  this.updateHasChanges();
                },
              },
              true
            );
          }}
        >
          {this.trans("buttons.upload_file")}
        </Button>
      );
    }

    return fofUploadButton;
  }

  returnTag(isEnabled, enabledText, disabledText) {
    return (
      <div className={clsx("SeoTag", !isEnabled && "SeoTagDisabled")}>
        {isEnabled ? enabledText : disabledText}
      </div>
    );
  }

  closeDialogButton() {
    return (
      <Button
        type="submit"
        className="Button Button--primary"
        loading={this.loading}
      >
        {this.closeText}
      </Button>
    );
  }

  updateHasChanges() {
    this.closeText =
      !this.wasManaged && this.autoUpdateData()
        ? this.trans("buttons.save_autofill")
        : this.trans("buttons.save");

    if (!this.wasManaged && this.autoUpdateData()) {
      this.closeInfoText = this.trans("notices.autofill_warning");
    } else {
      this.closeInfoText = null;
    }

    this.hasChanges = true;
  }

  submitData() {
    let data = {};

    data.autoUpdateData = this.autoUpdateData();

    data.title = this.metaTitle();
    data.description = this.description();

    // Add keywords
    if (this.keywords() !== "") {
      data.keywords = this.keywords() ?? null;
    }

    // Add robot settings
    data.robotsNoindex = this.robotsNoindex();
    data.robotsNofollow = this.robotsNofollow();
    data.robotsNoarchive = this.robotsNoarchive();
    data.robotsNoimageindex = this.robotsNoimageindex();
    data.robotsNosnippet = this.robotsNosnippet();

    // Add Twitter info
    if (this.twitterTitle() !== "") {
      data.twitterTitle = this.twitterTitle() ?? null;
    }

    if (this.twitterDescription() !== "") {
      data.twitterDescription = this.twitterDescription() ?? null;
    }

    if (this.twitterImage() !== "") {
      data.twitterImage = this.twitterImage();
    }

    if (this.twitterImageSource() !== "auto") {
      data.twitterImageSource = this.twitterImageSource() ?? null;
    }

    // Open graph
    if (this.openGraphTitle() !== "") {
      data.openGraphTitle = this.openGraphTitle() ?? null;
    }

    if (this.openGraphDescription() !== "") {
      data.openGraphDescription = this.openGraphDescription() ?? null;
    }
    if (this.openGraphImage() !== "") {
      data.openGraphImage = this.openGraphImage() ?? null;
    }

    if (this.openGraphImageSource() !== "auto") {
      data.openGraphImageSource = this.openGraphImageSource() ?? null;
    }

    if (this.estimatedReadingTime() !== "") {
      data.estimatedReadingTime = this.estimatedReadingTime() ?? null;
    }

    return data;
  }

  // Close or save setting
  onsubmit(e) {
    e.preventDefault();

    if (!this.hasChanges) {
      this.hide();
      return;
    }

    this.loading = true;

    this.meta
      .save(this.submitData())
      .then(() => {
        app.alerts.show({ type: "success" }, this.trans("alerts.saved"));
        this.hide();
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => {
        this.saving = false;
        m.redraw();
      });
  }

  onsaved() {
    this.hide();
  }
}
