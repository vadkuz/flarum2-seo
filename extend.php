<?php

namespace Vadkuz\Flarum2Seo;

use Flarum\Api\Context;
use Flarum\Api\Resource\ForumResource;
use Flarum\Api\Schema;
use Flarum\Database\AbstractModel;
use Flarum\Discussion\Discussion as FlarumDiscussion;
use Flarum\Extend;
use Vadkuz\Flarum2Seo\Controller\Robots;
use Vadkuz\Flarum2Seo\Controller\Sitemap;
use Vadkuz\Flarum2Seo\Extend\SEO;
use Vadkuz\Flarum2Seo\Listeners\PageListener;
use Vadkuz\Flarum2Seo\Page as SeoPage;
use Vadkuz\Flarum2Seo\SeoMeta\SeoMeta;

$events = (new Extend\Event())
    ->subscribe(Subscribers\DiscussionSubscriber::class)
    ->subscribe(Subscribers\PostSubscriber::class);

if (class_exists('Flarum\\Tags\\Tag')) {
    $events->subscribe(Subscribers\TagSubscriber::class);
}

return [
    (new Extend\Frontend('forum'))
        ->content(PageListener::class)
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/Forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/Admin.less'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\Routes('api'))
        ->post('/seo_social_media_image', 'seo.socialmedia.upload', Api\Controllers\UploadSocialMediaImageController::class)
        ->delete('/seo_social_media_image', 'seo.socialmedia.delete', Api\Controllers\DeleteSocialMediaImageController::class)
        ->get('/seo_meta', 'seo_meta.overview', Api\Controllers\ListSeoMetaController::class)
        ->get('/seo_meta/{id:\\d+}', 'seo_meta.get', Api\Controllers\ShowSeoMetaController::class)
        ->patch('/seo_meta/{id:\\d+}', 'seo_meta.update', Api\Controllers\UpdateSeoMetaController::class)
        ->get('/seo_meta/{object_type}-{id}', 'seo_meta.get_by_type', Api\Controllers\ShowSeoMetaController::class),

    (new Extend\ApiResource(ForumResource::class))
        ->fields(fn () => [
            Schema\Boolean::make('canConfigureSeo')
                ->get(fn (object $model, Context $context) => $context->getActor()->can('seo.canConfigure')),
        ]),

    (new Extend\Conditional())
        ->whenExtensionDisabled('fof-sitemap', function () {
            return [
                (new Extend\Routes('forum'))
                    ->get('/robots.txt', 'vadkuz-flarum2-seo.robots', Robots::class)
                    ->get('/sitemap.xml', 'vadkuz-flarum2-seo.sitemap', Sitemap::class),
            ];
        }),

    (new Extend\Formatter())
        ->render(Formatter\FormatLinks::class)
        ->configure(ConfigureLinks::class),

    (new Extend\Model(FlarumDiscussion::class))
        ->relationship('seoMeta', function (AbstractModel $model) {
            return $model->hasOne(SeoMeta::class, 'object_id', 'id')
                ->where('object_type', 'discussions');
        }),

    (new SEO())
        ->addExtender('index', SeoPage\IndexPage::class)
        ->addExtender('profile', SeoPage\ProfilePage::class)
        ->addExtender('tags', SeoPage\TagPage::class)
        ->addExtender('page_extension', SeoPage\PageExtensionPage::class)
        ->addExtender('discussion', SeoPage\DiscussionPage::class)
        ->addExtender('discussion_best_answer', SeoPage\DiscussionBestAnswerPage::class),

    $events,
];
