<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->nullable(false)->change();
            $table->boolean('is_new')->default(false)->nullable(false)->change();
            $table->boolean('is_best_seller')->default(false)->nullable(false)->change();
            $table->boolean('show_on_homepage')->default(false)->nullable(false)->change();
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->tinyInteger('is_featured')->default(0)->nullable(false)->change();
            $table->tinyInteger('is_new')->default(0)->nullable(false)->change();
            $table->tinyInteger('is_best_seller')->default(0)->nullable(false)->change();
            $table->tinyInteger('show_on_homepage')->default(0)->nullable(false)->change();
        });
    }
};
