<?php

namespace Vadkuz\Flarum2Seo\Controller;

use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Class Robots
 * @package Vadkuz\Flarum2Seo\Controller
 */
class Robots implements RequestHandlerInterface
{
    protected SettingsRepositoryInterface $settings;
    protected UrlGenerator $url;

    /**
     * Robots constructor.
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings, UrlGenerator $url)
    {
        $this->settings = $settings;
        $this->url = $url;
    }

    private function output()
    {
        $output = '';

        if ($this->settings->get('seo_allow_all_bots') !== '0') {
            $output .= 'User-agent: *';
            $output .= PHP_EOL . 'Allow: /' . PHP_EOL;
        }

        $output .= PHP_EOL . 'Sitemap: ' . $this->url->to('forum')->base() . '/sitemap.xml' . PHP_EOL;

        // Custom robots txt
        if ($this->settings->get('seo_robots_text') !== null && $this->settings->get('seo_robots_text') !== '') {
            $output .= $this->settings->get('seo_robots_text');
        }

        return $output;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $response = new Response();
        $response->getBody()->write($this->output());

        return $response->withHeader('Content-Type', 'text/plain; charset=utf-8');
    }
}
