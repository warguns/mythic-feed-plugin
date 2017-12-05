<?php
/**
 * @package Mythic
 * @version 1.6
 */
/*
Plugin Name: Mythic
Plugin URI: https://wordpress.org/plugins/hello-dolly/
Description: Mythic instagram photos.
Author: Cristian
Version: 1.6
Author URI: http://ma.tt/
Text Domain: mythic-tattoo
*/
defined( 'ABSPATH' ) or die();


function mythic_instagram( $atts ) {
    extract( shortcode_atts( array(
        'name' => 'mythic_tattoo_studio',
        'limit' => 30,
        'hashtag' => ''
    ), $atts ) );



    $images = [];
    $codes = [];
    $count = 0;
    $more_pages = true;
    $max_id = "";
    while ($count < $limit && $more_pages) {
        $json = json_decode(file_get_contents('https://www.instagram.com/' . $name . '/?__a=1&max_id=' . $max_id), true);
        foreach ($json['user']['media']['nodes'] as $image) {
            preg_match("/" . $hashtag."/", $image["caption"], $results);
            if (strlen($hashtag) == 0 || strlen($hashtag) > 0 && $results) {
                $images[] = $image['display_src'];
                $codes[] = $image['code'];
                $count++;
            }

            if ($count >= $limit) {
                break;
            }
        }
        $more_pages = $json['user']['media']['page_info']['has_next_page'];
        $max_id = $json['user']['media']['page_info']['end_cursor'];
    }



    return '<script>
                images = ' .json_encode($images) .';
                codes = ' . json_encode($codes) .';
                loadImages(images, codes);
            </script>
            <div id="workspace"></div>
            '; //
}

add_shortcode( 'mythic-feed', 'mythic_instagram' );


function mythic_scripts()
{
    // Register the script like this for a plugin:
    wp_register_script( 'mythic-script', plugins_url( '/assets/js/linear-partition.js', __FILE__ ));
    wp_register_script( 'mythic-script2', plugins_url( '/assets/js/grid-maker.js', __FILE__ ));


    // For either a plugin or a theme, you can then enqueue the script:
    wp_enqueue_script( 'mythic-script' );
    wp_enqueue_script( 'mythic-script2' );
}
add_action( 'wp_enqueue_scripts', 'mythic_scripts' );

function mythic_css()
{
    wp_register_style( 'mythic-style', plugins_url( '/assets/css/estilo.css', __FILE__ ), array(), '20120208', 'all');
    wp_enqueue_style( 'mythic-style' );
}
add_action('wp_enqueue_scripts', 'mythic_css');

?>