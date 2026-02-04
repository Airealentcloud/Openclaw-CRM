<?php
/**
 * Upload property images to WordPress Media Library
 * Run via CLI: php upload-images-cli.php
 */

// Load WordPress
require_once __DIR__ . '/../../../wp-load.php';

$imageFiles = [
    'C:\Users\USER\.openclaw\media\inbound\file_10---99dfec50-5728-4273-ab7e-43e884d2570c.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_11---96dd1145-2548-4a76-bc2e-fdfbc4ad670c.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_12---1ce1af4e-253d-4e10-b720-1f902ef285f1.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_13---98ef0be2-9bc2-473f-9a8d-c31bb65b2e83.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_14---49daf79e-fcd1-4535-bfcf-69dd4677649e.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_15---4e4551b5-7ce4-4624-8cb9-09af8a6d6b57.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_16---df727929-1313-4c7b-9306-093d2aec624d.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_17---8eb4567a-b40a-45af-ad9c-ea268f37ca62.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_18---efaaa479-e8c7-4263-98ed-9f5e365b20a0.jpg',
    'C:\Users\USER\.openclaw\media\inbound\file_19---ae6ca763-005e-4c4c-b6c2-30fba4407ede.jpg',
];

$property_id = 18851;

echo "Property Image Upload Script\n";
echo "============================\n";
echo "Property ID: $property_id\n";
echo "WordPress loaded: " . home_url() . "\n\n";

$uploaded_ids = [];

foreach ($imageFiles as $file) {
    if (!file_exists($file)) {
        echo "✗ Not found: $file\n";
        continue;
    }

    $filename = basename($file);
    echo "Uploading: $filename... ";

    // Check if already uploaded
    $existing = get_posts([
        'post_type' => 'attachment',
        'posts_per_page' => 1,
        'meta_key' => '_wp_attachment_metadata',
        'meta_value' => $filename,
        'fields' => 'ids',
    ]);

    if (!empty($existing)) {
        echo "Already exists (ID: {$existing[0]})\n";
        $uploaded_ids[] = $existing[0];
        continue;
    }

    // Upload file
    $upload = wp_upload_bits($filename, null, file_get_contents($file));

    if (isset($upload['error']) && $upload['error']) {
        echo "Error: {$upload['error']}\n";
        continue;
    }

    $wp_filetype = wp_check_filetype($filename, null);
    $attachment = [
        'post_mime_type' => $wp_filetype['type'],
        'post_title' => preg_replace('/\.[^.]+$/', '', $filename),
        'post_content' => '',
        'post_status' => 'inherit',
    ];

    $attach_id = wp_insert_attachment($attachment, $upload['file'], $property_id);

    if (is_wp_error($attach_id)) {
        echo "Error: {$attach_id->get_error_message()}\n";
        continue;
    }

    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
    wp_update_attachment_metadata($attach_id, $attach_data);

    echo "✓ Uploaded (ID: $attach_id)\n";
    $uploaded_ids[] = $attach_id;
}

echo "\n" . str_repeat('=', 50) . "\n";
echo "Summary:\n";
echo "- Total processed: " . count($imageFiles) . "\n";
echo "- Uploaded: " . count($uploaded_ids) . "\n";
echo "- Attachment IDs: " . implode(', ', $uploaded_ids) . "\n";

// Set featured image if we have uploads
if (!empty($uploaded_ids)) {
    $featured_id = $uploaded_ids[0];
    set_post_thumbnail($property_id, $featured_id);
    echo "\n✓ Featured image set to: $featured_id\n";
}
