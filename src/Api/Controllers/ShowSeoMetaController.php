<?php

namespace Vadkuz\Flarum2Seo\Api\Controllers;

use DateTimeInterface;
use Flarum\Api\JsonApiResponse;
use Flarum\Foundation\DispatchEventsTrait;
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Vadkuz\Flarum2Seo\SeoMeta\SeoMeta;

class ShowSeoMetaController implements RequestHandlerInterface
{
    use DispatchEventsTrait;

    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);

        $actor->assertCan('seo.canConfigure');

        $id = Arr::get($request->getQueryParams(), 'id', null);
        $objectType = Arr::get($request->getQueryParams(), 'object_type', null);

        if (is_null($id) || !is_numeric($id)) {
            throw new ValidationException([
                'message' => 'Invalid slug/id combination',
            ]);
        }

        if (is_null($objectType)) {
            $seoMeta = SeoMeta::findOrFail($id);
        } else {
            $seoMeta = SeoMeta::findByObjectTypeOrCreate($objectType, $id);
            $this->dispatchEventsFor($seoMeta, $actor);
        }

        return new JsonApiResponse([
            'data' => $this->serialize($seoMeta),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(SeoMeta $seoMeta): array
    {
        return [
            'type' => 'seoMeta',
            'id' => (string) $seoMeta->id,
            'attributes' => [
                'objectType' => $seoMeta->object_type,
                'objectId' => $seoMeta->object_id,
                'autoUpdateData' => (bool) $seoMeta->auto_update_data,
                'title' => $seoMeta->title,
                'description' => $seoMeta->description,
                'keywords' => $seoMeta->keywords,
                'robotsNoindex' => (bool) $seoMeta->robots_noindex,
                'robotsNofollow' => (bool) $seoMeta->robots_nofollow,
                'robotsNoarchive' => (bool) $seoMeta->robots_noarchive,
                'robotsNoimageindex' => (bool) $seoMeta->robots_noimageindex,
                'robotsNosnippet' => (bool) $seoMeta->robots_nosnippet,
                'twitterTitle' => $seoMeta->twitter_title,
                'twitterDescription' => $seoMeta->twitter_description,
                'twitterImage' => $seoMeta->twitter_image,
                'twitterImageSource' => $seoMeta->twitter_image_source ?? 'auto',
                'openGraphTitle' => $seoMeta->open_graph_title,
                'openGraphDescription' => $seoMeta->open_graph_description,
                'openGraphImage' => $seoMeta->open_graph_image,
                'openGraphImageSource' => $seoMeta->open_graph_image_source ?? 'auto',
                'estimatedReadingTime' => (int) $seoMeta->estimated_reading_time,
                'createdAt' => $this->formatDate($seoMeta->created_at),
                'updatedAt' => $this->formatDate($seoMeta->updated_at),
            ],
        ];
    }

    private function formatDate(mixed $value): ?string
    {
        if ($value instanceof DateTimeInterface) {
            return $value->format(DateTimeInterface::ATOM);
        }

        return is_string($value) ? $value : null;
    }
}
