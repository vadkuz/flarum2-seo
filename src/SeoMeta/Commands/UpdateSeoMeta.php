<?php

namespace Vadkuz\Flarum2Seo\SeoMeta\Commands;

use Flarum\User\User;

class UpdateSeoMeta
{
    public $actor;

    public $id;

    public $data;

    public function __construct(User $actor, $id, array $data)
    {
        $this->actor = $actor;
        $this->id = $id;
        $this->data = $data;
    }
}
