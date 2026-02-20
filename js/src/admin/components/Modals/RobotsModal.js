import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import saveSettings from "flarum/admin/utils/saveSettings";

export default class RobotsModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.value =
      typeof app.data.settings.seo_robots_text === "undefined"
        ? ""
        : app.data.settings.seo_robots_text;
    this.startValue = this.value;
    this.closeText = this.trans("close");
    this.loading = false;
  }

  trans(key) {
    return app.translator.trans(`vadkuz-flarum2-seo.admin.modals.robots.${key}`);
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
          {m("textarea", {
            className: "FormControl",
            value: this.value,
            placeholder: this.trans("placeholder"),
            rows: 15,
            oninput: (event) => {
              this.change(event.target.value);
            },
          })}
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
    data.seo_robots_text = this.value;

    saveSettings(data).then(this.onsaved.bind(this));
  }

  onsaved() {
    this.hide();
  }
}
