@echo off
echo ========================================
echo Property Listing Automation Setup
echo ========================================
echo.
echo This will help you set up property listing automation
echo for airealent.ng
echo.

echo Step 1: Get WordPress Application Password
echo ------------------------------------------
echo 1. Log in to airealent.ng/wp-admin
echo 2. Go to Users → Your Profile
echo 3. Scroll to "Application Passwords"
echo 4. Create new password (name: "Property Automation")
echo 5. Copy the generated password
echo.

echo Step 2: Update the script with your credentials
echo -----------------------------------------------
echo Open property-listing-automation.js in a text editor
echo Update lines 14-15 with:
echo   - Your WordPress username
echo   - The application password you copied
echo.

echo Step 3: Test the automation
echo ---------------------------
echo Run: node property-listing-automation.js --test --draft
echo This will create a sample property as a draft
echo.

echo Step 4: Create your first property
echo ----------------------------------
echo Option A: Interactive mode
echo   node property-listing-automation.js --interactive --draft
echo.
echo Option B: From JSON file
echo   node property-listing-automation.js --file=sample-property.json --draft
echo.

echo Step 5: Review and publish
echo --------------------------
echo 1. Check drafts at airealent.ng/wp-admin
echo 2. Add property images
echo 3. Publish when ready
echo.

echo Useful commands:
echo ----------------
echo Create template: node property-listing-automation.js --template
echo Batch create:   node property-listing-automation.js --file=properties.json --draft
echo Publish:        node property-listing-automation.js --file=properties.json
echo.

pause