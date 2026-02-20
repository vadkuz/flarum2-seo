import app from "flarum/admin/app";
import { extend } from "flarum/common/extend";
import DashboardPage from "flarum/admin/components/DashboardPage";
import SeoWidget from "./components/SeoWidget";
import SettingsPage from "./Pages/SettingsPage";
import PermissionGrid from "flarum/admin/components/PermissionGrid";

app.initializers.add("vadkuz-flarum2-seo", () => {
  app.registry.for("vadkuz-flarum2-seo").registerPage(SettingsPage);

  // Add widget
  extend(DashboardPage.prototype, "availableWidgets", (widgets) => {
    widgets.add("seo-widget", <SeoWidget />, 500);
  });

  app.registry.for("vadkuz-flarum2-seo").registerPermission(
    {
      icon: "fas fa-search",
      label: app.translator.trans(
        "vadkuz-flarum2-seo.admin.permissions.configure_seo"
      ),
      permission: "seo.canConfigure",
    },
    "seo",
    90
  );

  // Add addPermissions
  extend(PermissionGrid.prototype, "permissionItems", function (items) {
    // Add knowledge base permissions
    const extensionId = this.attrs?.extensionId;
    const permissions = extensionId
      ? app.registry.getExtensionPermissions(extensionId, "seo")?.toArray?.() ??
        []
      : app.registry.getAllPermissions("seo").toArray();

    items.add(
      "seo",
      {
        label: "SEO",
        children: permissions,
      },
      80
    );
  });
});

export * from "./components";
export * from "./Pages";
