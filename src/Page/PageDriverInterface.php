<?php

namespace Vadkuz\Flarum2Seo\Page;

use Psr\Http\Message\ServerRequestInterface;
use Vadkuz\Flarum2Seo\SeoProperties;

interface PageDriverInterface
{
    /**
     * A list of Flarum extension IDs for extensions that should be enabled
     */
    public function extensionDependencies(): array;

    /**
     * A list of route names that will be handled
     *
     * Empty array if handles for all routes
     */
    public function handleRoutes(): array;

    /**
     * Handle page SEO
     */
    public function handle(ServerRequestInterface $request, SeoProperties $seo);
}
