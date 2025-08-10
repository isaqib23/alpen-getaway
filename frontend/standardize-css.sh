#!/bin/bash

# CSS Standardization Automation Script
# Standardizes all CSS files by replacing hardcoded values with CSS variables

CSS_DIR="/Volumes/Work/web/alpen-getaway/frontend/src/assets/css"

echo "🚀 Starting CSS Standardization..."
echo "Target directory: $CSS_DIR"
echo ""

# Array of files to process (exclude utility files)
files=(
    "airport-transfer.css"
    "b2b-body.css"
    "booking-form.css"
    "booking-list.css" 
    "booking-management.css"
    "booking.css"
    "bookings.css"
    "car-details.css"
    "car-list.css"
    "cars-sidebar.css"
    "cars.css"
    "change-password.css"
    "checkout-session-page.css"
    "contact-info.css"
    "contact-map.css"
    "contact.css"
    "destinations.css"
    "experienced-drivers.css"
    "fleet-single-content.css"
    "fleets-collection.css"
    "fleets-single-sidebar.css"
    "footer.css"
    "forgot-password.css"
    "header.css"
    "home-faqs.css"
    "home-fleets.css"
    "home-hero.css"
    "home-how-it-works.css"
    "home-latest.css"
    "home-services.css"
    "home-testimonials.css"
    "home-why-choose-us.css"
    "home.css"
    "not-found.css"
    "pricing-details.css"
    "services.css"
    "sign-in.css"
    "sign-up.css"
    "trusted-partner.css"
    "unified-forms.css"
)

# Function to replace colors with CSS variables
replace_colors() {
    local file="$1"
    
    # Replace common hardcoded colors with CSS variables
    sed -i '' 's/#ff3600/var(--accent-color)/gi' "$file"
    sed -i '' 's/#FF6B35/var(--accent-color)/gi' "$file"
    sed -i '' 's/#ff6b35/var(--accent-color)/gi' "$file"
    sed -i '' 's/#131010/var(--primary-color)/gi' "$file"
    sed -i '' 's/#ffffff/var(--white-color)/gi' "$file"
    sed -i '' 's/#fff(?![0-9a-fA-F])/var(--white-color)/gi' "$file"
    sed -i '' 's/#616161/var(--text-color)/gi' "$file"
    sed -i '' 's/#1a1a1a/var(--text-dark)/gi' "$file"
    sed -i '' 's/#666/var(--text-light)/gi' "$file"
    sed -i '' 's/#333/var(--text-color)/gi' "$file"
    sed -i '' 's/#555/var(--text-color)/gi' "$file"
    sed -i '' 's/#f8f9fa/var(--bg-light)/gi' "$file"
    sed -i '' 's/#fafafa/var(--bg-section)/gi' "$file"
    sed -i '' 's/#f0f0f0/var(--bg-neutral)/gi' "$file"
    sed -i '' 's/#ececec/var(--border-color)/gi' "$file"
    sed -i '' 's/#dadada/var(--border-dark)/gi' "$file"
    sed -i '' 's/#ddd/var(--border-focus)/gi' "$file"
    sed -i '' 's/#eee/var(--border-light)/gi' "$file"
    
    # Status colors
    sed -i '' 's/#22bba7/var(--success-color)/gi' "$file"
    sed -i '' 's/#77bc23/var(--success-light)/gi' "$file"
    sed -i '' 's/#d1f9d1/var(--success-bg)/gi' "$file"
    sed -i '' 's/#ef6c00/var(--warning-color)/gi' "$file"
    sed -i '' 's/#fbdcc2/var(--warning-bg)/gi' "$file"
    sed -i '' 's/#e53935/var(--error-color)/gi' "$file"
    sed -i '' 's/#fbdfde/var(--error-bg)/gi' "$file"
    sed -i '' 's/#1e88e5/var(--info-color)/gi' "$file"
    sed -i '' 's/#d9e7f4/var(--info-bg)/gi' "$file"
}

# Function to remove gradients
remove_gradients() {
    local file="$1"
    
    # Replace linear gradients with solid colors
    sed -i '' 's/background: *linear-gradient([^;]*);/background: var(--accent-color);/gi' "$file"
    sed -i '' 's/background-image: *linear-gradient([^;]*);/background: var(--accent-color);/gi' "$file"
    
    # Replace radial gradients with solid colors  
    sed -i '' 's/background: *radial-gradient([^;]*);/background: var(--accent-color);/gi' "$file"
    sed -i '' 's/background-image: *radial-gradient([^;]*);/background: var(--accent-color);/gi' "$file"
}

# Function to standardize fonts
standardize_fonts() {
    local file="$1"
    
    sed -i '' 's/"DM Sans", sans-serif/var(--font-primary)/gi' "$file"
    sed -i '' 's/"Epilogue", sans-serif/var(--font-heading)/gi' "$file"
    sed -i '' 's/font-family: *"DM Sans"/font-family: var(--font-primary)/gi' "$file"
    sed -i '' 's/font-family: *"Epilogue"/font-family: var(--font-heading)/gi' "$file"
}

# Function to standardize transitions
standardize_transitions() {
    local file="$1"
    
    sed -i '' 's/transition: *all *0\.3s *ease/transition: var(--transition)/gi' "$file"
    sed -i '' 's/transition: *0\.3s *ease/transition: var(--transition)/gi' "$file"
    sed -i '' 's/transition: *all *0\.3s/transition: var(--transition)/gi' "$file"
}

# Process each file
for file in "${files[@]}"; do
    filepath="$CSS_DIR/$file"
    
    if [ -f "$filepath" ]; then
        echo "Processing: $file"
        
        # Create backup
        cp "$filepath" "$filepath.bak"
        
        # Apply transformations
        replace_colors "$filepath"
        remove_gradients "$filepath"
        standardize_fonts "$filepath"
        standardize_transitions "$filepath"
        
        echo "✓ Completed: $file"
    else
        echo "⚠ File not found: $file"
    fi
done

echo ""
echo "✅ CSS Standardization Complete!"
echo ""
echo "Next steps:"
echo "1. Review the changes using git diff"
echo "2. Test the application thoroughly"
echo "3. Remove .bak files if satisfied: rm $CSS_DIR/*.bak"
echo "4. Import the new CSS architecture in your main file"
echo ""
echo "To import the standardized CSS:"
echo "@import './_variables.css';"
echo "@import './_utilities.css';"
