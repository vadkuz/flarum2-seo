<?php

namespace Vadkuz\Flarum2Seo\Controller;

use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class Sitemap implements RequestHandlerInterface
{
    protected UrlGenerator $url;
    protected ExtensionManager $extensions;
    protected SettingsRepositoryInterface $settings;

    public function __construct(
        UrlGenerator $url,
        ExtensionManager $extensions,
        SettingsRepositoryInterface $settings
    ) {
        $this->url = $url;
        $this->extensions = $extensions;
        $this->settings = $settings;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $base = rtrim($this->url->to('forum')->base(), '/');
        $entries = [];

        $this->addUrl($entries, $base . '/');
        $this->addUrl($entries, $base . '/all');

        if ($this->extensions->isEnabled('flarum-tags')) {
            $this->addUrl($entries, $base . '/tags');
        }

        if ($this->extensions->isEnabled('vadkuz-flarum2-blog')) {
            $this->addUrl($entries, $base . '/blog');

            if (class_exists('Flarum\\Tags\\Tag')) {
                $tagIds = array_map('intval', array_filter(explode('|', (string) $this->settings->get('blog_tags', ''))));

                if (count($tagIds) > 0) {
                    /** @var \Illuminate\Support\Collection<int, \Flarum\Tags\Tag> $blogTags */
                    $blogTags = \Flarum\Tags\Tag::query()
                        ->whereIn('id', $tagIds)
                        ->get(['slug']);

                    foreach ($blogTags as $blogTag) {
                        if (!empty($blogTag->slug)) {
                            $this->addUrl($entries, $base . '/blog/category/' . rawurlencode((string) $blogTag->slug));
                        }
                    }
                }
            }
        }

        $discussions = Discussion::query()
            ->select(['id', 'slug', 'created_at', 'last_posted_at', 'hidden_at'])
            ->whereNull('hidden_at')
            ->orderByDesc('last_posted_at')
            ->limit(500)
            ->get();

        foreach ($discussions as $discussion) {
            $path = $this->url->to('forum')->route('discussion', [
                'id' => $discussion->id . '-' . $discussion->slug,
            ]);

            $this->addUrl($entries, $path, $discussion->last_posted_at ?? $discussion->created_at);
        }

        $xml = $this->renderXml($entries);

        $response = new Response();
        $response->getBody()->write($xml);

        return $response->withHeader('Content-Type', 'application/xml; charset=utf-8');
    }

    protected function addUrl(array &$entries, string $loc, ?\DateTimeInterface $lastMod = null): void
    {
        $entries[$loc] = [
            'loc' => $loc,
            'lastmod' => $lastMod ? $lastMod->format(DATE_ATOM) : null,
        ];
    }

    protected function renderXml(array $entries): string
    {
        $lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        foreach ($entries as $entry) {
            $lines[] = '  <url>';
            $lines[] = '    <loc>' . htmlspecialchars($entry['loc'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . '</loc>';

            if (!empty($entry['lastmod'])) {
                $lines[] = '    <lastmod>' . htmlspecialchars($entry['lastmod'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . '</lastmod>';
            }

            $lines[] = '  </url>';
        }

        $lines[] = '</urlset>';

        return implode(PHP_EOL, $lines) . PHP_EOL;
    }
}
