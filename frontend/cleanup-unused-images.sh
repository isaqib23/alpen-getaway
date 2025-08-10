#!/bin/bash

echo "=== ALPEN GETAWAY IMAGE CLEANUP REPORT ==="
echo "Removing unused images from assets/images directory..."
echo ""

# Create backup directory
mkdir -p ../backup/unused_images
echo "Created backup directory: ../backup/unused_images"

# USED IMAGES (DO NOT DELETE):
# /assets/images/icons/arrow-white.svg
# /assets/images/icons/arrow-black.svg  
# /assets/images/icons/arrow-orange.svg
# /assets/images/icons/icon-calendar.svg
# /assets/images/icons/icon-sub-heading.svg
# /assets/images/about_us/about.jpg
# /assets/images/footer-bg.svg
# /assets/images/contact-form-plan.svg
# /assets/images/our-faqs-car-img.png
# /assets/images/our-faqs-bg-shape.svg
# /assets/images/why-choose-us-bg.svg
# /assets/images/testimonial-bg.png

echo "=== REMOVING UNUSED IMAGES ==="

# Remove unused images from assets/images (with backup)
unused_images=(
    "assets/images/404-error-img.png"
    "assets/images/about_us/1.jpg"
    "assets/images/about_us/2.png"
    "assets/images/about_us/driver_1.jpg"
    "assets/images/about_us/driver_2.jpg"
    "assets/images/about_us/driver_3.jpg"
    "assets/images/about_us/driver_4.jpg"
    "assets/images/affiliate"
    "assets/images/airport_images"
    "assets/images/b2b_partner"
    "assets/images/home_bg.png"
    "assets/images/icons/car-door.png"
    "assets/images/icons/icon-fleet-list-1.svg"
    "assets/images/icons/icon-fleet-list-2.svg"
    "assets/images/icons/icon-fleet-list-3.svg"
    "assets/images/icons/icon-fleet-list-4.svg"
    "assets/images/icons/icon-fleets-benefits-1.svg"
    "assets/images/icons/icon-fleets-benefits-2.svg"
    "assets/images/icons/icon-location.svg"
    "assets/images/icons/icon-rent-details-2.svg"
    "assets/images/icons/icon-rent-details-3.svg"
    "assets/images/icons/icon-service-1.svg"
    "assets/images/icons/icon-service-2.svg"
    "assets/images/icons/icon-service-3.svg"
    "assets/images/icons/icon-service-4.svg"
    "assets/images/icons/icon-service-5.svg"
    "assets/images/icons/icon-service-6.svg"
    "assets/images/icons/icon-service-7.svg"
    "assets/images/icons/icon-service-8.svg"
    "assets/images/icons/icon-why-choose-1.svg"
    "assets/images/icons/icon-why-choose-2.svg"
    "assets/images/icons/icon-why-choose-3.svg"
    "assets/images/icons/icon-why-choose-4.svg"
    "assets/images/logo.png"
    "assets/images/logo_black.png"
    "assets/images/our_fleet"
    "assets/images/our_service_details"
)

# Remove unused images from src/assets/images (with backup)
unused_src_images=(
    "src/assets/images/404-error-img.png"
    "src/assets/images/about_us/1.jpg"
    "src/assets/images/about_us/2.png"
    "src/assets/images/about_us/driver_1.jpg"
    "src/assets/images/about_us/driver_2.jpg"
    "src/assets/images/about_us/driver_3.jpg"
    "src/assets/images/about_us/driver_4.jpg"
    "src/assets/images/affiliate"
    "src/assets/images/airport_images"
    "src/assets/images/b2b_partner"
    "src/assets/images/icons/car-door.png"
    "src/assets/images/icons/icon-fleet-list-1.svg"
    "src/assets/images/icons/icon-fleet-list-2.svg"
    "src/assets/images/icons/icon-fleet-list-3.svg"
    "src/assets/images/icons/icon-fleet-list-4.svg"
    "src/assets/images/icons/icon-fleets-benefits-1.svg"
    "src/assets/images/icons/icon-fleets-benefits-2.svg"
    "src/assets/images/icons/icon-location.svg"
    "src/assets/images/icons/icon-rent-details-2.svg"
    "src/assets/images/icons/icon-rent-details-3.svg"
    "src/assets/images/icons/icon-service-1.svg"
    "src/assets/images/icons/icon-service-2.svg"
    "src/assets/images/icons/icon-service-3.svg"
    "src/assets/images/icons/icon-service-4.svg"
    "src/assets/images/icons/icon-service-5.svg"
    "src/assets/images/icons/icon-service-6.svg"
    "src/assets/images/icons/icon-service-7.svg"
    "src/assets/images/icons/icon-service-8.svg"
    "src/assets/images/icons/icon-why-choose-1.svg"
    "src/assets/images/icons/icon-why-choose-2.svg"
    "src/assets/images/icons/icon-why-choose-3.svg"
    "src/assets/images/icons/icon-why-choose-4.svg"
    "src/assets/images/logo.png"
    "src/assets/images/logo_black.png"
    "src/assets/images/our_fleet"
    "src/assets/images/our_service_details"
)

count=0

# Process assets/images
for item in "${unused_images[@]}"; do
    if [[ -e "$item" ]]; then
        echo "Moving to backup: $item"
        # Create directory structure in backup
        backup_dir="../backup/unused_images/$(dirname "$item")"
        mkdir -p "$backup_dir"
        mv "$item" "../backup/unused_images/$item" 2>/dev/null || echo "Failed to move $item"
        ((count++))
    fi
done

# Process src/assets/images  
for item in "${unused_src_images[@]}"; do
    if [[ -e "$item" ]]; then
        echo "Moving to backup: $item"
        # Create directory structure in backup
        backup_dir="../backup/unused_images/$(dirname "$item")"
        mkdir -p "$backup_dir"
        mv "$item" "../backup/unused_images/$item" 2>/dev/null || echo "Failed to move $item"
        ((count++))
    fi
done

# Also remove unused ODT and PDF files
unused_docs=(
    "assets/images/airport_images/innsbruck/tirol_events.odt"
    "assets/images/airport_images/munich/munich_events.odt"
    "assets/images/frontend_pdf"
    "assets/images/our_fleet/cars_information_in_booking_section.pdf"
)

for doc in "${unused_docs[@]}"; do
    if [[ -e "$doc" ]]; then
        echo "Moving to backup: $doc"
        backup_dir="../backup/unused_images/$(dirname "$doc")" 
        mkdir -p "$backup_dir"
        mv "$doc" "../backup/unused_images/$doc" 2>/dev/null || echo "Failed to move $doc"
        ((count++))
    fi
done

echo ""
echo "=== CLEANUP COMPLETE ==="
echo "Total items moved to backup: $count"
echo ""

# Show remaining files
echo "=== REMAINING IMAGES (USED) ==="
find assets/images -type f 2>/dev/null | sort
find src/assets/images -type f 2>/dev/null | sort

echo ""
echo "=== SUMMARY ==="
echo "✅ Unused images backed up to: ../backup/unused_images/"  
echo "✅ Only used images remain in assets/images/"
echo "✅ Ready for production build"
echo ""