<?php

namespace Vadkuz\Flarum2Seo;

use Illuminate\Support\Collection;
use Vadkuz\Flarum2Seo\Page\PageDriverInterface;

interface SeoExtenderManagerInterface
{
    public function addExtender(string $name, PageDriverInterface $extender): void;

    public function getExtenders(?string $routeName = null): array;

    public function getActiveExtenders(): Collection;
}
