import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import saveSettings from "flarum/admin/utils/saveSettings";
import Stream from "flarum/common/utils/Stream";

export default class DoFollowListModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.domainDoFollowList = [];
    this.baseUrl = this.getDomainFromBase();
    this.domainDoFollowList =
      typeof app.data.settings.seo_dofollow_domains === "undefined"
        ? Stream([])
        : Stream(JSON.parse(app.data.settings.seo_dofollow_domains));
    this.startValue = this.domainDoFollowList;
    this.newDomain = Stream("");
    this.hasChanges = false;
    this.loading = false;
  }

  trans(key) {
    return app.translator.trans(
      `vadkuz-flarum2-seo.admin.modals.do_follow.${key}`
    );
  }

  title() {
    return this.trans("title");
  }

  getDomainFromBase() {
    const url = new URL(app.forum.data.attributes.baseUrl);
    const hostname = url.hostname.split(".");

    return hostname.slice(Math.max(hostname.length - 2, 0)).join(".");
  }

  content() {
    return (
      <div>
        <div className="Modal-body">
          <p>{this.trans("intro_1")}</p>
          <p>{this.trans("intro_2")}</p>
          <p style={{ marginBottom: "15px" }}>
            <a href={"https://github.com/vadkuz/flarum2-seo"} target={"_blank"}>
              {this.trans("learn_more_link")}
            </a>{" "}
            {this.trans("learn_more_suffix")}
          </p>

          <div className={"FlarumSEO-DoFollowList"}>
            <input type="text" value={this.baseUrl} readonly className={"FormControl"} />
            <Button className={"Button"} icon={"fas fa-times"} disabled />
          </div>

          {this.domainDoFollowList().map((domain, key) => {
            return (
              <div className={"FlarumSEO-DoFollowList"}>
                <input
                  type="text"
                  value={domain}
                  onkeyup={(e) => this.updateDomain(key, e.target.value)}
                  className={"FormControl"}
                />
                <Button
                  className={"Button"}
                  icon={"fas fa-times"}
                  onclick={() => this.removeDomain(key)}
                />
              </div>
            );
          })}

          <div className={"FlarumSEO-DoFollowList"}>
            <input
              type="text"
              bidi={this.newDomain}
              placeholder={this.trans("new_domain_placeholder")}
              onkeydown={(e) => {
                if (e.keyCode === 13 && this.newDomain() !== "") {
                  e.preventDefault();
                  this.addDomain();
                }
              }}
              className={"FormControl"}
            />
            <Button
              className={`Button ${this.newDomain() !== "" ? "Button--primary" : ""}`}
              icon={"fas fa-plus"}
              onclick={this.addDomain.bind(this)}
            />
          </div>
        </div>
        <div style="padding: 25px 30px; text-align: center;">
          <Button type="submit" className="Button Button--primary" loading={this.loading}>
            {this.hasChanges ? this.trans("save_changes") : this.trans("close")}
          </Button>
        </div>
      </div>
    );
  }

  addDomain() {
    if (this.domainDoFollowList().indexOf(this.newDomain()) >= 0) {
      alert(this.trans("duplicate_domain_alert"));
      this.newDomain("");
      return;
    }

    const updatedData = [...this.domainDoFollowList()];
    updatedData.push(this.newDomain());
    this.domainDoFollowList(updatedData);
    this.newDomain("");
    this.hasChanges = true;
  }

  removeDomain(key) {
    const updatedData = [...this.domainDoFollowList()];
    updatedData.splice(key, 1);
    this.domainDoFollowList(updatedData);
    this.hasChanges = true;
  }

  updateDomain(key, value) {
    const updatedData = [...this.domainDoFollowList()];
    updatedData[key] = value;
    this.domainDoFollowList(updatedData);
    this.hasChanges = true;
  }

  onsubmit() {
    if (!this.hasChanges) {
      this.hide();
      return;
    }

    this.loading = true;

    const data = {};
    data.seo_dofollow_domains = JSON.stringify(
      this.domainDoFollowList().filter((val) => val !== "")
    );

    saveSettings(data).then(this.onsaved.bind(this));
  }

  onsaved() {
    this.hide();
  }
}
