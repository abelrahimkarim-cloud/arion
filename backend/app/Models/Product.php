<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'is_featured',
        'is_new',
        'is_best_seller',
        'show_on_homepage',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_best_seller' => 'boolean',
        'show_on_homepage' => 'boolean',
    ];

    // Allow accessing the attribute in camelCase (`showOnHomepage`) as well as snake_case
    public function getShowOnHomepageAttribute()
    {
        return (bool) ($this->attributes['show_on_homepage'] ?? false);
    }

    public function setShowOnHomepageAttribute($value)
    {
        $this->attributes['show_on_homepage'] = (bool) $value;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
